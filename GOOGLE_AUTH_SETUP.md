# 設定 Google 認證 (Google Auth)

本文件將引導您如何在 Google Cloud Console 中設定 Google OAuth，並在您的 Nuxt.js 應用程式中啟用 Google 認證功能。

## 1. 在 Google Cloud Console 中設定 OAuth 同意畫面和憑證

1.  前往 [Google Cloud Console](https://console.cloud.google.com/)。
2.  登入您的 Google 帳戶。
3.  如果您還沒有專案，請建立一個新專案。
4.  在左側導覽列中，選擇 **API 和服務 (APIs & Services)** > **OAuth 同意畫面 (OAuth consent screen)**。
    *   **使用者類型 (User Type)**：選擇 **外部 (External)**，然後點擊 **建立 (CREATE)**。
    *   **應用程式名稱 (App name)**：輸入您的應用程式名稱 (例如：`SideBling App`)。
    *   **使用者支援電子郵件 (User support email)**：選擇您的電子郵件地址。
    *   **開發人員聯絡資訊 (Developer contact information)**：輸入您的電子郵件地址。
    *   點擊 **儲存並繼續 (SAVE AND CONTINUE)**。
    *   **範圍 (Scopes)**：目前不需要新增任何範圍，點擊 **儲存並繼續 (SAVE AND CONTINUE)**。
    *   **測試使用者 (Test users)**：您可以新增測試使用者，以便在應用程式發佈前進行測試。點擊 **儲存並繼續 (SAVE AND CONTINUE)**。
    *   **摘要 (Summary)**：檢閱您的設定，然後點擊 **返回資訊主頁 (BACK TO DASHBOARD)**。
    *   **發佈狀態 (Publishing status)**：將狀態從 **測試 (Testing)** 變更為 **發佈中 (In production)**。

5.  在左側導覽列中，選擇 **API 和服務 (APIs & Services)** > **憑證 (Credentials)**。
    *   點擊頂部的 **建立憑證 (CREATE CREDENTIALS)**，然後選擇 **OAuth 用戶端 ID (OAuth client ID)**。
    *   **應用程式類型 (Application type)**：選擇 **網頁應用程式 (Web application)**。
    *   **名稱 (Name)**：輸入一個名稱 (例如：`Nuxt App Web Client`)。
    *   **已授權的 JavaScript 來源 (Authorized JavaScript origins)**：
        *   新增 `http://localhost:3000` (用於開發環境)。
        *   如果您有生產環境的網域，請新增該網域 (例如：`https://your-production-domain.com`)。
    *   **已授權的重新導向 URI (Authorized redirect URIs)**：
        *   新增 `http://localhost:3000/api/auth/callback/google` (用於開發環境)。
        *   如果您有生產環境的網域，請新增該網域 (例如：`https://your-production-domain.com/api/auth/callback/google`)。
    *   點擊 **建立 (CREATE)**。
    *   您將會看到您的 **用戶端 ID (Client ID)** 和 **用戶端密鑰 (Client Secret)**。請將它們複製下來，因為您稍後會需要用到。

## 2. 設定環境變數

在您的專案根目錄下建立一個 `.env` 檔案 (如果尚未建立)，並新增以下環境變數。請將 `YOUR_GOOGLE_CLIENT_ID` 和 `YOUR_GOOGLE_CLIENT_SECRET` 替換為您從 Google Cloud Console 獲得的值。

```
NUXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
NUXT_PUBLIC_GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NUXT_PUBLIC_AUTH_ORIGIN=http://localhost:3000
```

**重要提示：**
*   `NUXT_PUBLIC_AUTH_ORIGIN` 應該設定為您的應用程式的基礎 URL。在開發環境中通常是 `http://localhost:3000`。在生產環境中，請務必將其更改為您的實際網域。
*   `NUXT_PUBLIC_` 前綴表示這些變數將在客戶端和伺服器端都可用。

完成這些設定後，您就可以開始在 Nuxt.js 應用程式中整合 Google 認證功能了。