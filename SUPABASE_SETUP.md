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

# Supabase 服務金鑰 (service_role secret key)
SUPABASE_SERVICE_KEY="your_supabase_service_role_key"
```

-   `SUPABASE_URL` 和 `SUPABASE_KEY` / `SUPABASE_SERVICE_KEY` 可以在 Supabase 儀表板的 **Settings > API** 中找到。

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

本專案使用以下兩個資料表來儲存使用者資料與互動記錄。

### `users` 資料表

此資料表用於儲存使用者的公開基本資料，與 Supabase 內建的 `auth.users` 表同步。

**SQL 結構定義：**
```sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text
);
```

**欄位說明：**
-   `id` (uuid): 主鍵，與 `auth.users` 的 `id` 關聯。`ON DELETE CASCADE` 確保當使用者從認證系統中刪除時，其對應的資料也會被刪除。
-   `created_at` (timestamptz): 使用者資料建立的時間戳。
-   `email` (text): 使用者的電子郵件地址。
-   `full_name` (text): 使用者的全名。
-   `avatar_url` (text): 使用者頭像的 URL。

**自動化與安全性：**
-   **觸發器 (Trigger)**: 當新使用者註冊時，`handle_new_user` 函式會被觸發，自動將新使用者的資訊從 `auth.users` 複製到此 `public.users` 表中。
-   **行級安全策略 (RLS)**:
    -   `Allow individual read access`: 允許使用者讀取自己的資料。
    -   `Allow individual update access`: 允許使用者更新自己的資料。

### `user_interactions` 資料表

此資料表用於儲存使用者提交的提示詞以及 Gemini API 的回應。

**SQL 結構定義：**
```sql
CREATE TABLE public.user_interactions (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  prompt text NOT NULL,
  response jsonb
);
```

**欄位說明：**
-   `id` (bigserial): 自動遞增的主鍵。
-   `user_id` (uuid): 外鍵，關聯到 `users` 表的 `id`，用以識別是哪位使用者的互動。
-   `created_at` (timestamptz): 此筆互動記錄的建立時間。
-   `prompt` (text): 使用者輸入的原始提示詞。
-   `response` (jsonb): 儲存從 Gemini API 回傳的完整回應，使用 `jsonb` 格式可以儲存結構化的資料。

**安全性：**
-   **行級安全策略 (RLS)**:
    -   `Allow individual access to interactions`: 允許使用者對自己的互動記錄進行所有操作（讀取、新增、更新、刪除），但無法存取其他人的記錄。