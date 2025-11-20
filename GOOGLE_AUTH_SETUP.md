# Google 認證設定指南

本指南將說明如何在 Google Cloud Console 中設定 OAuth 2.0 Client ID，以便將 Google 認證整合到您的應用程式中。

## 步驟 1: 建立 Google Cloud 專案 (如果尚未建立)

1.  前往 [Google Cloud Console](https://console.cloud.google.com/)。
2.  在頁面頂部，點擊專案選擇器下拉選單。
3.  點擊「新專案 (New Project)」。
4.  輸入專案名稱，然後點擊「建立 (Create)」。

## 步驟 2: 設定 OAuth 同意畫面

1.  在 Google Cloud Console 中，導航到「API 和服務 (APIs & Services)」>「OAuth 同意畫面 (OAuth consent screen)」。
2.  選擇「外部 (External)」使用者類型，然後點擊「建立 (Create)」。
3.  填寫以下資訊：
    *   **應用程式名稱 (App name)**: 您的應用程式名稱 (例如：Gemini Career Advisor)。
    *   **使用者支援電子郵件 (User support email)**: 您的電子郵件地址。
    *   **應用程式網域 (App domains)**:
        *   **授權網域 (Authorized domains)**: 添加您的應用程式部署網域 (例如：`localhost` 用於開發，以及您的生產網域)。
    *   **開發人員聯絡資訊 (Developer contact information)**: 您的電子郵件地址。
4.  點擊「儲存並繼續 (Save and Continue)」。
5.  在「範圍 (Scopes)」頁面，您可以添加應用程式所需的 Google API 範圍。對於基本的登入，通常需要 `.../auth/userinfo.email` 和 `.../auth/userinfo.profile`。點擊「添加或移除範圍 (Add or Remove Scopes)」，選擇所需的範圍，然後點擊「更新 (Update)」。
6.  點擊「儲存並繼續 (Save and Continue)」。
7.  在「測試使用者 (Test users)」頁面，添加可以測試您的應用程式的 Google 帳戶。
8.  點擊「儲存並繼續 (Save and Continue)」。
9.  審查您的設定，然後返回儀表板。

## 步驟 3: 建立 OAuth 2.0 Client ID

1.  在 Google Cloud Console 中，導航到「API 和服務 (APIs & Services)」>「憑證 (Credentials)」。
2.  點擊「建立憑證 (Create Credentials)」下拉選單，然後選擇「OAuth 用戶端 ID (OAuth client ID)」。
3.  在「應用程式類型 (Application type)」中，選擇「網頁應用程式 (Web application)」。
4.  輸入「名稱 (Name)」(例如：`Nuxt App Web Client`)。
5.  在「授權的 JavaScript 來源 (Authorized JavaScript origins)」中，添加您的應用程式的 URL。
    *   開發環境：`http://localhost:3000` (或您 Nuxt 應用程式運行的任何埠號)。
    *   生產環境：您的應用程式的生產 URL (例如：`https://your-app.com`)。
6.  在「授權的重新導向 URI (Authorized redirect URIs)」中，添加您的 Supabase 專案提供的回呼 URL。
    *   **重要提示**: 這一步是整合 Supabase 第三方登入最關鍵的部分。您必須使用 Supabase 提供的回呼 URL，而不是您自己的應用程式 URL。
    *   您可以在 Supabase 儀表板的 **Authentication > Providers > Google** 設定頁面中找到這個 URL。它的格式通常是：`https://<您的專案參考 ID>.supabase.co/auth/v1/callback`。
    *   請將上述 URL 完整複製並貼到「授權的重新導向 URI」欄位中。
7.  點擊「建立 (Create)」。
8.  您將看到一個彈出視窗，其中包含您的「用戶端 ID (Client ID)」和「用戶端密鑰 (Client Secret)」。**請務必記下這些值**，因為您將在應用程式的環境變數中使用它們。

## 步驟 4: 啟用 Google People API (可選，但推薦)

為了獲取使用者的個人資料 (例如姓名、頭像)，您可能需要啟用 Google People API。

1.  在 Google Cloud Console 中，導航到「API 和服務 (APIs & Services)」>「程式庫 (Library)」。
2.  搜尋「Google People API」。
3.  點擊「啟用 (Enable)」。

## 步驟 5: 在 Supabase 中設定 Google Provider 並檢查環境變數

取得 Google Client ID 和 Client Secret 後，您需要將它們設定在 Supabase 儀表板中，而不是直接放在專案的 `.env` 檔案裡。

1.  **前往 Supabase 儀表板**
    *   在您的專案中，導航到 **Authentication > Providers**。
    *   找到並啟用 **Google**。
    *   將您從 Google Cloud Console 複製的 **Client ID** 和 **Client Secret** 貼入對應的欄位中。
    *   點擊 **Save**。

2.  **設定專案的環境變數**
    *   您的 Nuxt 專案只需要連接到 Supabase 所需的環境變數。請確保您的 `.env` 檔案中包含 `SUPABASE_URL` 和 `SUPABASE_KEY`。
    *   詳細的環境變數結構，請參閱 `SUPABASE_SETUP.md` 文件。