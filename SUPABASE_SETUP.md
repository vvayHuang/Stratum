# Supabase 專案設定指南

本指南將引導您為此應用程式設定一個新的 Supabase 專案，配置 Google 身份驗證，並獲取將應用程式連接到您的 Supabase 後端所需的金鑰。

## 1. 建立一個新的 Supabase 專案

1.  前往 [Supabase 網站](https://supabase.com/) 並登入或建立一個新帳戶。
2.  登入後，您將被重定向到您的儀表板。
3.  點擊 **「New Project」** 按鈕。
4.  選擇一個組織並為您的專案命名。
5.  產生一個安全的 **資料庫密碼** 並將其保存在安全的地方。如果您需要直接連接到資料庫，您將需要它。
6.  選擇離您的使用者最近的 **地區**。
7.  點擊 **「Create New Project」**。Supabase 將需要幾分鐘時間來設定您的新專案。

## 2. 檢索 Supabase API 金鑰

專案建立後，您需要獲取 API 金鑰以將您的應用程式連接到 Supabase。

1.  從您的專案儀表板，導航到 **「Settings」** 頁面（左側邊欄中的齒輪圖示）。
2.  在設定菜單中點擊 **「API」**。
3.  在 **「Project API keys」** 部分，您將找到您的 **Project URL** 和您的 `anon` **public** 金鑰。
4.  您還需要您的 `service_role` 秘密金鑰以進行伺服器端操作。**請將此金鑰視為密碼，切勿在客戶端代碼中洩露。**

您需要將這些金鑰添加到您專案的環境變數中。在您專案的根目錄中建立一個 `.env` 檔案並添加以下內容：

```
SUPABASE_URL="您的_SUPABASE_專案_URL"
SUPABASE_KEY="您的_SUPABASE_ANON_PUBLIC_KEY"
SUPABASE_SERVICE_KEY="您的_SUPABASE_SERVICE_ROLE_KEY"
```

將 `"您的_SUPABASE_專案_URL"`、`"您的_SUPABASE_ANON_PUBLIC_KEY"` 和 `"您的_SUPABASE_SERVICE_ROLE_KEY"` 替換為您 Supabase 專案中的實際值。

## 3. 設定 Google 身份驗證

要讓使用者能夠使用他們的 Google 帳戶登入，您需要在 Supabase 中配置 Google 提供商。

1.  在您的 Supabase 專案中，前往 **「Authentication」**（側邊欄中的使用者圖示），然後選擇 **「Providers」**。
2.  在提供商列表中找到 **Google** 並啟用它。
3.  您將看到一個 **Redirect URL**。複製此 URL。
4.  現在，您需要建立 Google OAuth2 憑證：
    a.  前往 [Google API Console](https://console.developers.google.com/)。
    b.  建立一個新專案或選擇一個現有專案。
    c.  導航到 **「APIs & Services」** -> **「Credentials」**。
    d.  點擊 **「Create Credentials」** 並選擇 **「OAuth client ID」**。
    e.  選擇 **「Web application」** 作為應用程式類型。
    f.  為客戶端命名（例如，「Supabase Auth」）。
    g.  在 **「Authorized redirect URIs」** 下，添加您從 Supabase 複製的 **Redirect URL**。
    h.  點擊 **「Create」**。
5.  您現在將看到您的 **Client ID** 和 **Client Secret**。複製這些值。
6.  返回 Supabase 儀表板，並將 **Client ID** 和 **Client Secret** 貼到 Google 提供商設定中的相應欄位中。
7.  點擊 **「Save」**。

## 4. 建立 `users` 資料表

我們需要一個資料表來儲存使用者資訊。當使用者註冊時，Supabase 會自動在 `auth` 結構中建立一個 `users` 資料表。我們可以添加一個公開的 `profiles` 資料表來儲存我們希望公開訪問的其他使用者資料。

1.  在您的 Supabase 專案中，前往 **「Table Editor」**（側邊欄中的表格圖示）。
2.  點擊 **「New Table」**。
3.  將資料表名稱設定為 `profiles`。
4.  暫時禁用 **「Row Level Security (RLS)」**。我們稍後會啟用它。
5.  添加以下欄位：
    *   `id` (UUID, Primary Key, 預設值: `uuid_generate_v4()`) - 這將是 `auth.users.id` 資料表的外鍵。
    *   `updated_at` (timestamptz, 預設值: `now()`)
    *   `username` (text)
    *   `full_name` (text)
    *   `avatar_url` (text)

6.  點擊 **「Save」**。

## 5. 建立 `prompts` 資料表

此資料表將儲存使用者發送的提示詞和 AI 的回應。

1.  在 **「Table Editor」** 中，點擊 **「New Table」**。
2.  將資料表名稱設定為 `prompts`。
3.  啟用 **「Row Level Security (RLS)」**。
4.  添加以下欄位：
    *   `id` (bigint, Primary Key, identity)
    *   `user_id` (UUID, Foreign Key to `public.profiles.id`)
    *   `prompt_text` (text)
    *   `response_text` (text)
    *   `created_at` (timestamptz, 預設值: `now()`)

5.  點擊 **「Save」**。

現在您的 Supabase 專案已設定完畢，並準備好與應用程式整合。