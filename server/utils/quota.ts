// 用量額度。
//
// 計數放在獨立的 usage_log 表，而不是數 prompts 的筆數 —— 否則使用者只要
// 刪掉自己的紀錄就能把當日額度歸零。檢查與扣除由 consume_quota() 在單一
// 交易內完成，並發請求不會全部通過檢查。

export const QUOTA_LIMITS = {
  idea: { limit: 3, window: '24 hours' },
  guide: { limit: 10, window: '24 hours' },
} as const;

export type QuotaAction = keyof typeof QUOTA_LIMITS;

type AdminClient = ReturnType<typeof getAdminSupabase>;

export type QuotaResult =
  | { status: 'allowed' }
  | { status: 'exceeded' }
  | { status: 'error' };

export async function consumeQuota(
  client: AdminClient,
  userId: string,
  action: QuotaAction,
): Promise<QuotaResult> {
  const { limit, window } = QUOTA_LIMITS[action];

  const { data, error } = await client.rpc('consume_quota', {
    p_user_id: userId,
    p_action: action,
    p_limit: limit,
    p_window: window,
  });

  if (error) {
    console.error(`Failed to consume '${action}' quota:`, error);
    return { status: 'error' };
  }

  return data === true ? { status: 'allowed' } : { status: 'exceeded' };
}

// 生成失敗時把名額還回去，免得一次 Gemini 逾時就白白吃掉使用者一個額度。
export async function releaseQuota(
  client: AdminClient,
  userId: string,
  action: QuotaAction,
): Promise<void> {
  const { error } = await client.rpc('release_quota', {
    p_user_id: userId,
    p_action: action,
  });

  if (error) {
    console.error(`Failed to release '${action}' quota:`, error);
  }
}
