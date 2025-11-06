# OpenAI API 金鑰設定

若要將 OpenAI 整合至此應用程式，您需要提供 OpenAI API 金鑰。

## 步驟

1.  **取得您的 OpenAI API 金鑰：**
    *   如果您還沒有 OpenAI 帳戶，請前往 [https://platform.openai.com/signup](https://platform.openai.com/signup) 註冊。
    *   登入後，前往 [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)。
    *   點擊「建立新的秘密金鑰」按鈕以產生新的 API 金鑰。請務必複製此金鑰並妥善保管，因為您將無法再次看到它。

2.  **建立一個 `.env` 檔案：**
    *   在此專案的根目錄中（與 `package.json` 檔案位於相同層級），建立一個名為 `.env` 的新檔案。

3.  **將您的 API 金鑰新增至 `.env` 檔案：**
    *   開啟 `.env` 檔案並新增以下這一行，將 `your-api-key-here` 替換為您從 OpenAI 儀表板複製的實際 API 金鑰：

    ```
    OPENAI_API_KEY=your-api-key-here
    ```

4.  **重新啟動您的開發伺服器：**
    *   如果您的開發伺服器正在執行，請停止它並使用 `npm run dev` 重新啟動，以確保載入新的環境變數。

完成這些步驟後，應用程式將能夠使用您的 OpenAI API 金鑰向 OpenAI API 進行驗證。
