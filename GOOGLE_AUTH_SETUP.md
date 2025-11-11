# Google OAuth 認證設定指南

本文件將引導您完成在 Google Cloud Console 中設定 OAuth 2.0，以便在您的應用程式中啟用 Google 登入功能。

## 步驟一：建立或選擇現有的 Google Cloud 專案

1.  前往 [Google Cloud Console](https://console.cloud.google.com/)。
2.  如果您已經有一個專案，請在頁面頂端的專案下拉式選單中選取它。
3.  如果沒有，請點擊「新增專案」，並依照指示建立一個新專案。

## 步驟二：啟用 APIs & Services

1.  在左側導覽面板中，選擇「**APIs & Services**」 > 「**Enabled APIs & services**」。
2.  點擊頂端的「**+ ENABLE APIS AND SERVICES**」。
3.  搜尋「**Google People API**」並啟用它。這是 `nuxt-auth` 獲取使用者基本資料所需的 API。

## 步驟三：設定 OAuth 同意畫面 (OAuth consent screen)

在您建立憑證之前，您必須先設定同意畫面。

1.  在左側導覽面板中，選擇「**APIs & Services**」 > 「**OAuth consent screen**」。
2.  選擇使用者類型：
    *   **內部 (Internal)**：僅限您的 G Suite 組織內部的使用者。
    *   **外部 (External)**：適用於任何擁有 Google 帳戶的使用者。如果您希望任何人都能登入，請選擇此項。
3.  點擊「**建立 (Create)**」。
4.  填寫必要的應用程式資訊：
    *   **應用程式名稱 (App name)**：您的應用程式顯示給使用者的名稱。
    *   **使用者支援電子郵件 (User support email)**：使用者尋求支援時可以聯繫的電子郵件。
    *   **開發人員聯絡資訊 (Developer contact information)**：Google 用於通知您專案變更的電子郵件。
5.  點擊「**儲存並繼續 (SAVE AND CONTINUE)**」。
6.  在「**範圍 (Scopes)**」頁面，直接點擊「**儲存並繼續 (SAVE AND CONTINUE)**」，`nuxt-auth` 會自動處理所需的範圍。
7.  在「**測試使用者 (Test users)**」頁面，如果您的應用程式處於「測試」模式，您需要新增允許登入的 Google 帳戶。開發期間，您可以新增自己的 Google 帳戶。
8.  點擊「**儲存並繼續 (SAVE AND CONTINUE)**」。
9.  檢視摘要頁面，然後點擊「**返回資訊主頁 (BACK TO DASHBOARD)**」。

## 步驟四：建立 OAuth 2.0 用戶端 ID 憑證

1.  在左側導覽面板中，選擇「**APIs & Services**」 > 「**Credentials**」。
2.  點擊頂端的「**+ CREATE CREDENTIALS**」，然後選擇「**OAuth client ID**」。
3.  在「**應用程式類型 (Application type)**」下拉式選單中，選擇「**網頁應用程式 (Web application)**」。
4.  為您的用戶端 ID 命名，例如「My Nuxt App Client」。
5.  設定「**已授權的 JavaScript 來源 (Authorized JavaScript origins)**」：
    *   點擊「**+ ADD URI**」。
    *   輸入您應用程式的基礎 URL。在開發環境中，這通常是 `http://localhost:3000`。
6.  設定「**已授權的重新導向 URI (Authorized redirect URIs)**」：
    *   點擊「**+ ADD URI**」。
    *   輸入您應用程式的回呼 URL (callback URL)。對於 `@sidebase/nuxt-auth`，預設的回呼路徑是 `/api/auth/callback/google`。
    *   因此，在開發環境中，您應該輸入 `http://localhost:3000/api/auth/callback/google`。
7.  點擊「**建立 (CREATE)**」。

## 步驟五：取得您的用戶端 ID 和用戶端密鑰

建立後，一個視窗會彈出，顯示您的「**用戶端 ID (Your Client ID)**」和「**用戶端密鑰 (Your Client Secret)**」。請務必妥善保管這些資訊。

## 步驟六：設定環境變數

在您的專案根目錄下，建立或開啟 `.env` 檔案，並加入以下變數：

```env
# Auth Secret (用於簽署 JWT 的隨機字串，長度至少 32 個字元)
# 你可以使用 `openssl rand -base64 32` 來產生一個
NUXT_AUTH_SECRET='請在此貼上您產生的密鑰'

# Google OAuth 憑證
NUXT_OAUTH_GOOGLE_CLIENT_ID='請在此貼上您的用戶端 ID'
NUXT_OAUTH_GOOGLE_CLIENT_SECRET='請在此貼上您的用戶端密鑰'

# 應用程式的基礎 URL
AUTH_ORIGIN='http://localhost:3000'
```

**重要提示**：
*   `NUXT_AUTH_SECRET` 是一個非常重要的安全密鑰。請確保它足夠複雜且不被洩漏。
*   切勿將您的 `.env` 檔案提交到版本控制系統 (例如 Git) 中。

完成以上步驟後，您的應用程式就應該能夠成功使用 Google 帳戶進行認證了。