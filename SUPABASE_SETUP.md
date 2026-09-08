# Supabase 專案設定指南

本文檔提供設定 Supabase 專案、整合 Google 認證以及了解專案資料庫結構的完整說明。

---

## 1. 專案資訊

請在此處填寫您 Supabase 專案的詳細資訊，這些資訊可以在您的 [Supabase 專案儀表板](https://supabase.com/dashboard) 的設定中找到。

-   **Project Name**: `[請填寫您的專案名稱]`
-   **Project ID**: `[請填寫您的專案 ID]`
-   **Region**: `[請填寫您的專案所在區域]`
-   **Status**: `[請填寫您的專案狀態，例如：Active]`
-   **Database URL**: `https://isydlwezlrtrahmlxjwl.supabase.co`

---

## 2. 環境變數設定 (`.env`)

您的 Nuxt 應用程式需要以下環境變數來連接到 Supabase 和 Gemini。請在專案的根目錄建立一個 `.env` 檔案，並填入以下內容。

```bash
# Gemini API 金鑰
GEMINI_API_KEY="your_gemini_api_key"

# Supabase 專案 URL
SUPABASE_URL="your_supabase_project_url"

# Supabase 公開金鑰 (anon public key)
SUPABASE_KEY="your_supabase_anon_public_key"

# Supabase 服務金鑰 (service_role secret key) —— 只在伺服器端使用，絕不可外流
SUPABASE_SECRET_KEY="your_supabase_service_role_key"
```

-   `SUPABASE_URL` 和 `SUPABASE_KEY` / `SUPABASE_SECRET_KEY` 可以在 Supabase 儀表板的 **Settings > API** 中找到。

---

## 3. Google 認證設定

請依照以下步驟設定 Google 第三方登入。

### 步驟 1：在 Google Cloud Console 中設定 OAuth

1.  前往 [Google Cloud Console](https://console.cloud.google.com/)。
2.  建立一個新專案或選取現有專案。
3.  在左側導覽列中，前往 **APIs & Services > Credentials**。
4.  點擊 **Create Credentials**，然後選擇 **OAuth client ID**。
5.  **設定同意畫面 (Consent Screen)**：選擇 **External**，並填寫必要資訊。
6.  **建立 OAuth Client ID**：
    *   **Application type**：選擇 **Web application**。
    *   **Authorized redirect URIs**：點擊 **Add URI**，並貼上您 Supabase 專案的回呼 URL。
        *   您可以在 Supabase 儀表板的 **Authentication > Providers > Google** 設定中找到這個 URL。它的格式通常是：`https://<您的專案參考 ID>.supabase.co/auth/v1/callback`。
7.  建立完成後，複製您的 **Client ID** 和 **Client Secret**。

### 步驟 2：在 Supabase 中設定 Google Provider

1.  回到 Supabase 儀表板。
2.  前往 **Authentication > Providers**。
3.  找到並啟用 **Google**。
4.  將剛剛從 Google Cloud Console 複製的 **Client ID** 和 **Client Secret** 貼上。
5.  **關閉 "Confirm email" 選項**，以確保使用者透過 Google 登入後能無縫接軌，不需再次驗證信箱。
6.  點擊 **Save**。

---

## 4. 資料庫結構

本專案的資料庫結構經過精心設計，以儲存使用者、提示、AI 生成的想法，以及每個想法的詳細報告和執行步驟。

### `users` 資料表

此資料表用於儲存使用者的公開基本資料，與 Supabase 內建的 `auth.users` 表同步。

-   **SQL 結構定義：**
    ```sql
    CREATE TABLE public.users (
      id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      email text UNIQUE NOT NULL,
      full_name text,
      avatar_url text
    );
    ```

### `prompts` 資料表

此資料表儲存使用者提交的每一個初始提示詞。

-   **SQL 結構定義：**
    ```sql
    CREATE TABLE public.prompts (
      id bigserial PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      prompt text NOT NULL,
      response jsonb
    );
    ```
-   **說明**：`response` 欄位儲存了從 Gemini API 收到的原始 JSON 回應（包含多個想法）。

-   **行級安全性 (Row Level Security - RLS)**：所有資料表的 RLS 與欄位授權，統一定義在
    `supabase/migrations/20260908000000_security_hardening.sql`，請以該檔案為準（見下方第 6 節）。
    `prompts` 的重點是：任何人可讀取（首頁與 community 需要），但只有本人能刪除自己的紀錄，
    且 `response` 欄位不對前端開放。

### `ideas` 資料表

此資料表儲存從使用者提示詞中由 AI 生成的各個獨立想法。

-   **SQL 結構定義：**
    ```sql
    CREATE TABLE public.ideas (
      id bigserial PRIMARY KEY,
      prompt_id bigint REFERENCES public.prompts(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    ```
-   **說明**：每個想法都透過 `prompt_id` 與一個提示相關聯。

### `reports` 資料表

當使用者針對某個想法請求詳細指南時，此資料表會儲存該指南的摘要資訊。

-   **SQL 結構定義：**
    ```sql
    CREATE TABLE public.reports (
      id bigserial PRIMARY KEY,
      idea_id bigint UNIQUE REFERENCES public.ideas(id) ON DELETE CASCADE,
      earnings_potential text,
      competitive_score smallint CHECK (competitive_score >= 0 AND competitive_score <= 10),
      created_at timestamptz NOT NULL DEFAULT now()
    );
    ```
-   **說明**：`idea_id` 是唯一的，確保每個想法只有一份報告。`earnings_potential` 儲存潛在收益範圍，`competitive_score` 儲存 0-10 的競爭力分數。

### `steps` 資料表

此資料表儲存詳細報告中的每一個具體執行步驟。

-   **SQL 結構定義：**
    ```sql
      created_at timestamptz NOT NULL DEFAULT now()
    );
    ```
-   **說明**：每個步驟都透過 `report_id` 與一份報告相關聯，`step_number` 用於排序。

---

## 5. 安全與成本控制 (Safety & Cost Control)

為了防止 API 費用意外暴增，強烈建議您在 Google Cloud Console 進行以下設定。

### 設定 API 配額 (Quotas)

這是最有效的「硬性」限制，一旦超過設定次數，Google 會直接阻擋請求，確保不會產生額外費用。

1.  前往 [Google Cloud Console - Quotas](https://console.cloud.google.com/iam-admin/quotas)。
2.  在篩選器中輸入 **"Generative Language API"**。
3.  找到相關的配額項目，例如 **"Requests per minute"** (每分鐘請求數) 或 **"Requests per day"** (每日請求數)。
    *   *注意：具體名稱可能會隨 Google 更新而變動，請尋找與 request count 相關的項目。*
4.  勾選該項目，點擊右上角的 **EDIT QUOTAS**。
5.  將數值設定為一個保守的安全值。例如，對於作品集網站，您可以設定：
    *   **Requests per day**: 50 ~ 100 (足夠讓您和面試官測試，但能防止被惡意刷單)。

### 設定預算通知 (Budgets & Alerts)

這不會自動停止服務，但會在費用快要超過預算時發送 Email 通知您。

1.  前往 [Google Cloud Console - Budgets](https://console.cloud.google.com/billing/budgets)。
2.  點擊 **CREATE BUDGET**。
3.  **Name**: 輸入一個名稱，例如 "SideBling Safety Budget"。
4.  **Amount**: 設定您的月預算上限，例如 **$10 USD** (或您願意的最小金額)。
5.  **Actions**: 預設會設定在已用 50%, 90%, 100% 時通知您。保留預設即可。
6.  勾選 **"Email alerts to billing admins and users"**。
7.  點擊 **FINISH**。

---

## 6. 資安設定 (Security)

所有 RLS policy、欄位層級授權與用量額度，集中定義在：

```
supabase/migrations/20260908000000_security_hardening.sql
```

請在 **Supabase Dashboard > SQL Editor** 執行一次。內容具冪等性，重複執行安全。

### 重點設計

-   **`usage_log` 資料表**：append-only 的用量紀錄，與 `prompts` 分離。
    額度若是靠數 `prompts` 的筆數計算，使用者只要刪掉自己的紀錄就能把當日額度歸零。
    此表沒有任何 RLS policy，等同於前端完全無法存取，只有 service_role 能讀寫。

-   **`consume_quota()` / `release_quota()`**：額度的檢查與扣除在同一個交易內完成，
    並用 advisory lock 讓同一使用者的並發請求排隊 —— 否則同時送出的多個請求會全部
    通過檢查，各自呼叫一次 Gemini。兩個函式都只授權給 service_role 執行。

-   **欄位層級授權**：RLS 只能控制「列」，擋不住欄位。`users.email` 與
    `prompts.response` 前端從未使用，直接從 `anon` / `authenticated` 收回 SELECT 權限。
    因此前端查詢**不可以使用 `select('*')`** 於 `users` 與 `prompts`，必須列出欄位名稱。

-   **寫入路徑**：`ideas` / `reports` / `steps` / `users` 前端一律唯讀，
    所有寫入都經由伺服器端的 service_role client。
