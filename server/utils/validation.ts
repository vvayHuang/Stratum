// 送進 API 的 body 完全由使用者控制，型別與長度都要先確認過再往下傳。
// 沒有長度上限的話，一個 1 MB 的字串就是一次高額的 Gemini token 費用。

export const MAX_PROMPT_LENGTH = 500;

// 存進資料庫並公開顯示在社群動態牆上，所以模型的輸出也要設上限。
export const MAX_TITLE_LENGTH = 120;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_EARNINGS_LENGTH = 60;

export function parseText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) return null;
  return trimmed;
}

export function parseId(value: unknown): number | null {
  const id = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

// 模型輸出不保證符合約定的格式，寫進資料庫前先截斷到欄位允許的長度。
export function clampText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export async function readJsonBody(event: any): Promise<Record<string, unknown> | null> {
  try {
    const body = await readBody(event);
    return body && typeof body === 'object' && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}
