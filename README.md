# Stratum - AI 職涯顧問 (AI Career Advisor)

這是一個基於 Nuxt 4 構建的 AI 職涯顧問專案。它利用 Google Gemini API 根據使用者的興趣生成創意的職涯想法。專案使用 Tailwind CSS v4 進行樣式設計，GSAP 處理動畫效果，並整合了 Supabase 用於使用者身份驗證（Google OAuth）與資料庫儲存。

## 主要功能

- **AI 驅動建議**：輸入愛好或興趣，Gemini API 會生成三條潛在的職涯路徑。
- **詳細指南**：選擇一個想法即可生成完整的步驟指南，包括收入潛力與競爭力評分。
- **社群頁面**：瀏覽由社群分享的所有提示詞與創意畫廊。
- **個人想法管理**：登入後的使用者可以在「我的想法」專區管理自己的提示詞與生成的指南。
- **搜尋與刪除**：使用者可以搜尋特定的提示詞，並刪除自己提交的內容。
- **Supabase 整合**：處理使用者帳號、Google OAuth 登入，並將所有互動資料、想法與指南持久化儲存於 PostgreSQL 資料庫。
- **Material Design 3 主題**：全介面採用基於 Material Design 3 的語義化色彩系統，並在 `tailwind.config.cjs` 中配置。

## 技術棧與 Nuxt 模組 (Tech Stack & Modules)

本專案採用 Nuxt 4 生態系中的多項現代化模組，以確保應用的效能與安全性：

- **Nuxt v4**: 核心全端框架，支援 SSR、自動化路由與 Nitro 後端引擎。
- **Tailwind CSS v4**: 使用最新的 `@tailwindcss/vite` 整合，提供極速的 CSS 建置與強大的樣式功能。
- **@nuxtjs/supabase**: 負責使用者登入 (Google OAuth) 與資料庫 (PostgreSQL) 的即時連動與安全性設定。
- **@nuxtjs/google-fonts**: 優化字體載入流程，確保品牌字體能流暢且高效地在瀏覽器中顯示。
- **GSAP**: 用於實現高品質的 UI 動畫特效，提升使用者互動體驗。
- **Google Generative AI SDK**: 官方 SDK，連結 Gemini 2.5 Flash 模型，將使用者的創意轉化為具體的職涯建議。

## 架構概觀

本專案為一個全端應用程式，基於 Nuxt 4 框架打造，充分利用其強大的伺服器端渲染 (SSR) 與 API 端點建立功能。

- **前端 (Frontend)**：使用者介面採用 Vue 3 建構。路由包括首頁 (`/`)、社群頁面 (`/community`)、受保護的使用者想法頁面 (`/my-ideas`)，以及特定提示詞的動態路由 (`/prompts/:id`)。UI 元件（如導覽列、搜尋彈窗等）位於 `components/` 目錄下。
- **後端 (Backend)**：後端邏輯封裝在 `server/api/gemini.post.ts` 中。此端點負責與 Google Gemini API 通訊及 Supabase 資料庫互動，確保 API 金鑰的安全性。
- **資料庫 (Database)**：資料由 Supabase 管理。結構定義在 `types/database.types.ts` 中。主要資料表包括 `users`、`prompts`、`ideas`、`reports` 和 `steps`。
- **身份驗證 (Authentication)**：透過 `@nuxtjs/supabase` 模組處理，支援 Google OAuth 登入，並使用 `middleware/auth.js` 保護專屬頁面。

## 快速開始

1. **安裝依賴項**：
   ```bash
   npm install
   ```

2. **設定環境變數**：
   您需要為 Gemini API 和 Supabase 設定憑證。
   ```bash
   cp .env.example .env
   ```
   在生成的 `.env` 檔案中填寫必要的值。詳細說明請參考 `GEMINI_API_KEY.md` 和 `SUPABASE_SETUP.md`。

3. **啟動開發伺服器**：
   ```bash
   npm run dev
   ```

應用程式將在 `http://localhost:3000` 啟動。
