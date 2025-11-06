# Gemini API 金鑰設定

若要將 Google Gemini 整合至此應用程式，您需要提供 Gemini API 金鑰。

## 步驟

1.  **取得您的 Gemini API 金鑰：**
    *   前往 [Google AI Studio](https://aistudio.google.com/)。
    *   使用您的 Google 帳戶登入。
    *   點擊「取得 API 金鑰」按鈕。
    *   複製產生的 API 金鑰。

2.  **更新您的 `.env` 檔案：**
    *   開啟您先前建立的 `.env` 檔案。
    *   您可以移除或註解掉舊的 `OPENAI_API_KEY`。
    *   新增以下這一行，將 `your-gemini-api-key-here` 替換為您從 Google AI Studio 複製的實際 API 金鑰：

    ```
    GEMINI_API_KEY=your-gemini-api-key-here
    ```

3.  **重新啟動您的開發伺服器：**
    *   如果您的開發伺服器正在執行，請停止它並使用 `npm run dev` 重新啟動，以確保載入新的環境變數。

完成這些步驟後，應用程式將能夠使用您的 Gemini API 金鑰向 Google AI 進行驗證。
