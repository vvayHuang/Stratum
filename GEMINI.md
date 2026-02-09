# 專案概覽

這是一個從 Figma 設計啟動的 Nuxt v4 專案。它使用 Tailwind CSS v4 進行樣式設計，並使用 GSAP 進行動畫。該專案的目標是提供一個網頁介面，讓使用者可以根據他們的興趣，使用 Google Gemini API 獲取職涯建議。

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

# 核心技術與 Nuxt 模組

本專案利用多個 Nuxt 模組與套件來簡化開發並提升效能：

- **`@nuxtjs/supabase`**：提供與 Supabase 的深度整合，包含 `useSupabaseUser` 與 `useSupabaseClient` 組合式函數，用於身分驗證、Session 管理以及資料庫互動。
- **`@nuxtjs/google-fonts`**：自動化下載與載入 Google 字體，減少排版閃爍並提升載入效能。
- **`@nuxtjs/tailwindcss` & `@tailwindcss/vite`**：專為 Nuxt 4 與 Tailwind CSS v4 設計的建置工具，提供極速的開發編譯體驗與現代化樣式支援。
- **`GSAP (GreenSock)`**：業界標準的動畫庫，負責處理介面元件的進出場動畫。
- **`@paper-design/shaders`**：提供高效能的 Shader 效果，用於提升網頁的視覺張力與動態質感（如 Mesh Gradient）。
- **`@google/generative-ai`**：官方 Gemini SDK，用於後端與 AI 模型進行結構化提示 (Prompting) 與回應處理。

# 建置與運行

要開始使用此專案，請按照以下步驟操作：

1. **安裝依賴項：**
   ```bash
   npm install
   ```

2. **設定 Supabase：**
   - 請參閱 `SUPABASE_SETUP.md`，了解如何建立 Supabase 專案、設定 Google 身份驗證以及獲取所需的 API 金鑰的詳細說明。

3. **設定環境變數：**
   - 在專案根目錄中建立一個 `.env` 檔案。
   - 添加以下變數，並填寫您的 Gemini 和 Supabase 專案的值：
     ```
     GEMINI_API_KEY="your_gemini_api_key"
     SUPABASE_URL="your_supabase_project_url"
     SUPABASE_KEY="your_supabase_anon_public_key"
     SUPABASE_SERVICE_KEY="your_supabase_service_role_key"
     ```

4. **運行開發伺服器：**
   ```bash
   npm run dev
   ```

5. **建置生產版本：**
   ```bash
   npm run build
   ```

6. **預覽生產版本：**
   ```bash
   npm run start
   ```

# 開發慣例

- **樣式**：專案使用 Tailwind CSS v4。實用程式類別應直接在 Vue 元件中用於樣式設計。
- **佈局結構**：遵循語義化 HTML 規範。例如，`Footer` 應置於 `main` 標籤之外，以確保頁面結構清晰。
- **代碼品質**：近期對首頁 (`index.vue`) 進行了優化，移除了未使用的組件引用（如 `Cards.vue`）、過時的註解代碼（如 Loading Overlay）以及冗餘的導入（如 `gsap`、`watchEffect`），並修正了生命週期鉤子 (`onMounted`) 的正確引用。
- **色彩主題**：專案採用了基於 Material Design 3 的語義化色彩系統。所有顏色變數都在 `tailwind.config.cjs` 中定義。開發時應優先使用這些語義化名稱（例如 `bg-light-primary`），而不是寫死的色碼。
- **身份驗證**：身份驗證由 `@nuxtjs/supabase` 模組處理。`Navbar.vue` 等 UI 元件使用組合式函數來管理使用者狀態。
- **錯誤處理**：當 API 發生錯誤時，UI 會提供美化的錯誤訊息，並提供使用者返回初始狀態的選項。

# API 整合與資料庫

為了讓所有訪客都能看到首頁上的提示詞，`prompts` 資料表已設置為公開可讀（僅限 `SELECT` 操作）。`INSERT`、`UPDATE` 和 `DELETE` 操作則僅限已登入的使用者。

後端 API (`server/api/gemini.post.ts`) 有兩種模式：
1. **想法生成**：將使用者提示傳送至 Gemini，生成 3 個職涯想法並儲存至資料庫。
2. **指南生成**：為特定想法生成詳細指南，包括收入潛力、競爭力評分與執行步驟，並持久化儲存。

# 動畫

該專案使用 GSAP 庫進行動畫：
- **Hero 元件**：在提交提示時動畫退出。
- **社群區塊**：在切換頁面或狀態時提供流暢的過場。
- **Prompt 佈局**：淡入顯示載入狀態與結果。