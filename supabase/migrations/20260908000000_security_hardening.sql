-- 資安強化 migration
--
-- 在 Supabase Dashboard > SQL Editor 執行一次即可。內容具冪等性，重複執行安全。
--
-- 涵蓋：
--   1. usage_log      — append-only 用量計數，取代「數 prompts 筆數」的可繞過作法
--   2. consume_quota  — 檢查與扣除在同一交易內完成，關掉並發競態窗口
--   3. RLS            — 所有資料表明確啟用並設定 policy
--   4. 欄位層級授權    — users.email 與 prompts.response 不再對前端公開

begin;

-- ---------------------------------------------------------------------------
-- 1. 用量紀錄
-- ---------------------------------------------------------------------------
-- 刻意與 prompts 分離：使用者刪除自己的 prompt 不應該把當日額度一併歸零。
create table if not exists public.usage_log (
  id         bigserial   primary key,
  user_id    uuid        not null references auth.users (id) on delete cascade,
  action     text        not null,
  created_at timestamptz not null default now(),
  constraint usage_log_action_check check (action in ('idea', 'guide'))
);

create index if not exists usage_log_user_action_created_idx
  on public.usage_log (user_id, action, created_at desc);

-- 不建立任何 policy，等同於 anon / authenticated 完全無法讀寫；
-- 只有帶 service_role key 的伺服器端能存取。
alter table public.usage_log enable row level security;

revoke all on public.usage_log from anon, authenticated;
grant  all on public.usage_log to service_role;
grant  usage, select on sequence public.usage_log_id_seq to service_role;

-- ---------------------------------------------------------------------------
-- 2. 額度扣除（原子操作）
-- ---------------------------------------------------------------------------
-- 舊作法是「先 count 再呼叫 Gemini，最後才寫入」，中間隔了數秒，
-- 同時送出的多個請求會全部通過檢查。這裡把 count 與 insert 收進同一個
-- 交易，並用 advisory lock 讓同一使用者的請求排隊。
create or replace function public.consume_quota(
  p_user_id uuid,
  p_action  text,
  p_limit   integer,
  p_window  interval
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_used integer;
begin
  perform pg_advisory_xact_lock(
    hashtextextended(p_user_id::text || ':' || p_action, 0)
  );

  select count(*) into v_used
  from public.usage_log
  where user_id = p_user_id
    and action = p_action
    and created_at >= now() - p_window;

  if v_used >= p_limit then
    return false;
  end if;

  insert into public.usage_log (user_id, action) values (p_user_id, p_action);
  return true;
end;
$$;

-- 生成失敗時把額度還給使用者，避免一次 Gemini 503 就白白吃掉一個名額。
create or replace function public.release_quota(
  p_user_id uuid,
  p_action  text
)
returns void
language sql
security definer
set search_path = public, pg_temp
as $$
  delete from public.usage_log
  where id = (
    select id from public.usage_log
    where user_id = p_user_id and action = p_action
    order by created_at desc, id desc
    limit 1
  );
$$;

-- security definer 函式必須明確收回前端角色的執行權。
revoke all on function public.consume_quota(uuid, text, integer, interval) from public, anon, authenticated;
revoke all on function public.release_quota(uuid, text)                    from public, anon, authenticated;
grant execute on function public.consume_quota(uuid, text, integer, interval) to service_role;
grant execute on function public.release_quota(uuid, text)                    to service_role;

-- ---------------------------------------------------------------------------
-- 3. RLS：全部啟用
-- ---------------------------------------------------------------------------
alter table public.users   enable row level security;
alter table public.prompts enable row level security;
alter table public.ideas   enable row level security;
alter table public.reports enable row level security;
alter table public.steps   enable row level security;

-- 先清掉既有 policy，確保最終狀態與這份檔案一致（而不是疊加在未知設定上）。
do $$
declare r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('users', 'prompts', 'ideas', 'reports', 'steps', 'usage_log')
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- users：社群動態牆需要顯示作者，因此開放讀取（email 由下方欄位授權擋掉）。
create policy "users_public_read" on public.users
  for select using (true);

-- prompts：公開閱讀維持首頁 / community 功能；只有本人能刪除自己的紀錄。
create policy "prompts_public_read" on public.prompts
  for select using (true);

create policy "prompts_owner_delete" on public.prompts
  for delete using (auth.uid() = user_id);

-- ideas / reports / steps：前端只讀，寫入一律走伺服器端 service_role。
create policy "ideas_public_read" on public.ideas
  for select using (true);

create policy "reports_public_read" on public.reports
  for select using (true);

create policy "steps_public_read" on public.steps
  for select using (true);

-- ---------------------------------------------------------------------------
-- 4. 欄位層級授權
-- ---------------------------------------------------------------------------
-- RLS 只能控制「列」，擋不住欄位。users.email 與 prompts.response
-- 前端從未使用，直接從 anon / authenticated 收回。
revoke select on public.users from anon, authenticated;
grant  select (id, created_at, full_name, avatar_url) on public.users to anon, authenticated;

revoke select on public.prompts from anon, authenticated;
grant  select (id, user_id, created_at, prompt) on public.prompts to anon, authenticated;

-- 寫入路徑一律經過伺服器端，前端不需要任何寫入權限（prompts 的刪除除外）。
revoke insert, update, delete on public.users   from anon, authenticated;
revoke insert, update, delete on public.ideas   from anon, authenticated;
revoke insert, update, delete on public.reports from anon, authenticated;
revoke insert, update, delete on public.steps   from anon, authenticated;
revoke insert, update         on public.prompts from anon, authenticated;
revoke delete                 on public.prompts from anon;

commit;
