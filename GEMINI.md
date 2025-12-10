# 專案概覽

這是一個從 Figma 設計啟動的 Nuxt.js v3 專案。它使用 Tailwind CSS 進行樣式設計，並使用 GSAP 進行動畫。該專案的目標是提供一個網頁介面，讓使用者可以根據他們的興趣，使用 Google Gemini API 獲取職涯建議。

該專案現在整合了 **Supabase**，用於使用者身份驗證（透過 Google OAuth）和資料庫儲存。為了打造一個協作的環境，專案增加了一個 **社群頁面 (`/community`)**，所有使用者提交的公開提示詞都會展示在此處以供探索。已登入的使用者也擁有一個個人的 **「我的想法」(`my-ideas`)** 專區，來管理自己的提示詞和生成的指南。應用程式還包括了**搜尋**和**刪除**功能。

該專案的結構是一個標準的 Nuxt 應用程式：
- `pages/index.vue`：主要的應用程式登陸頁面。
- `pages/community.vue`：展示所有來自社群的公開提示詞。
- `pages/my-ideas.vue`：一個受保護的頁面，讓使用者檢視和管理自己的想法。
- `pages/prompts/[id].vue`：一個動態路由，用於顯示特定的提示詞及其詳細資訊。
- `components/`：包含可重用的 Vue 元件，如 `Navbar.vue`、`CommunityCard.vue`、`SearchModal.vue` 和 `DeleteConfirmationModal.vue`。
- `server/api/gemini.post.ts`：與 Gemini API 通訊並處理資料庫互動（建立、讀取、刪除）的伺服器端 API 路由。
- `nuxt.config.ts`：用於設定 Tailwind 和 Supabase 模組的 Nuxt 配置檔案。
- `SUPABASE_SETUP.md`：設定 Supabase 專案和資料庫結構的詳細指南。
- **資料庫表格**：該專案使用關聯式結構來儲存使用者資料、提示和生成的指南。主要表格包括 `users`、`prompts`、`ideas`、`reports` 和 `steps`。

# 建置與運行

要開始使用此專案，請按照以下步驟操作：

1.  **安裝依賴項：**
    ```bash
    npm install
    ```

2.  **設定 Supabase：**
    - 請參閱 `SUPABASE_SETUP.md`，了解如何建立 Supabase 專案、設定 Google 身份驗證以及獲取所需的 API 金鑰的詳細說明。

3.  **設定您的環境變數：**
    - 在專案根目錄中建立一個 `.env` 檔案。
    - 添加以下變數，並填寫您的 Gemini 和 Supabase 專案的值：
      ```
      GEMINI_API_KEY="your_gemini_api_key"
      SUPABASE_URL="your_supabase_project_url"
      SUPABASE_KEY="your_supabase_anon_public_key"
      SUPABASE_SERVICE_KEY="your_supabase_service_role_key"
      ```

4.  **運行開發伺服器：**
    ```bash
    npm run dev
    ```

5.  **建置生產版本：**
    ```bash
    npm run build
    ```

6.  **預覽生產版本：**
    ```bash
    npm run start
    ```

# 開發慣例

- **樣式**：專案使用 Tailwind CSS。實用程式類別應直接在 Vue 元件中用於樣式設計。
- **色彩主題**：專案採用了基於 Material Design 3 的語義化色彩系統。所有顏色變數都在 `tailwind.config.cjs` 中定義，並分為 `light` 和 `dark` 兩種模式，同時也提供了完整的調色板（例如 `primary`、`secondary` 等）。開發時應優先使用這些語義化名稱（例如 `bg-light-primary`, `text-light-on-surface`），而不是寫死的色碼，以確保主題的一致性。
- **身份驗證**：身份驗證由 `@nuxtjs/supabase` 模組處理。`Navbar.vue` 和 `LoginModal.vue` 等 UI 元件使用組合式函數 (`useSupabaseUser`、`useSupabaseClient`) 來管理使用者狀態和操作。
- **錯誤處理**：當 Gemini API 過載（503 錯誤）或發生其他錯誤時，UI 會提供美化的錯誤訊息，並提供使用者返回初始狀態的選項。

# API 整合與資料庫

為了讓所有訪客都能看到首頁上的提示詞輪播，`prompts` 資料表已設置為公開可讀。這是透過一條寬鬆的 RLS (Row Level Security) 策略實現的，該策略僅適用於 `SELECT` 操作。`INSERT`、`UPDATE` 和 `DELETE` 操作仍然受到限制，只有已登入的使用者才能對其自己的資料進行操作。

該專案的後端是一個單一的無伺服器函數 (`server/api/gemini.post.ts`)，它有兩種主要操作模式，由前端協調。

### 模式 1：想法生成

1.  **觸發**：使用者透過初始提示提交他們的興趣。
2.  **API 呼叫**：前端將提示發送到 `/api/gemini` 端點。
3.  **Gemini 提示**：後端建構一個提示，要求 Gemini API (`gemini-2.5-flash` 模型) 以結構化的 JSON 格式提供 3 個職涯想法。
4.  **資料庫儲存**：
    -   使用者的原始提示儲存到 `prompts` 表格。
    -   生成的 3 個想法儲存到 `ideas` 表格，每個想法都連結到 `prompt_id`。
5.  **回應**：新建立的想法物件（包括其資料庫 ID）返回到前端。

### 模式 2：指南生成

1.  **觸發**：使用者點擊特定想法的「生成指南」按鈕。
2.  **API 呼叫**：前端將 `idea` 物件（包括其 ID）與 `generateGuide: true` 標誌一起發送到 `/api/gemini` 端點。
3.  **Gemini 提示**：後端建構一個新的詳細提示，要求 Gemini API 為特定想法提供完整的指南。此提示要求一個 JSON 物件，其中包含 `earnings_potential`、`competitive_score` 和一個 `steps` 陣列（每個步驟都有標題和描述）。
4.  **資料庫儲存**：
    -   在 `reports` 表格中建立一個新行，包含 `idea_id`、`earnings_potential` 和 `competitive_score`。
    -   步驟陣列插入到 `steps` 表格中，每個步驟都連結到新的 `report_id`。
5.  **回應**：完整的報告（包括巢狀步驟）從資料庫中獲取並返回到前端，以便在 `ReportContainer` 元件中顯示。這確保一旦生成報告，它就會被持久化，並且無需再次從 Gemini API 獲取。

# 動畫

該專案使用 GSAP 庫進行動畫，以增強使用者體驗。
- **Hero 元件 (`components/Hero.vue`)**：在提交提示時動畫退出。
- **Cards 元件 (`components/Cards.vue`)**：與 Hero 元件一起動畫退出。
- **Prompt 佈局 (`components/PromptLayout.vue`)**：淡入以顯示載入狀態，然後顯示結果。
