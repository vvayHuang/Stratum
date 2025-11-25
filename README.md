# Stratum - AI Career Advisor

This is a Nuxt.js v3 project that serves as an AI-powered career advisor. It leverages the Google Gemini API to generate creative career ideas based on user interests. The project uses Tailwind CSS for styling, GSAP for animations, and is integrated with Supabase for user authentication (Google OAuth) and database storage.

## Key Features

- **AI-Powered Suggestions**: Enter a hobby or interest, and the Gemini API will generate three potential career paths.
- **Detailed Guides**: Select an idea to generate a full step-by-step guide, including earnings potential and a competitive score.
- **Supabase Integration**: Handles user accounts, Google OAuth, and persists all user interactions, ideas, and generated guides in a PostgreSQL database.
- **Public Showcase**: The homepage features a running carousel of prompts submitted by all users, allowing for idea discovery even without logging in.
- **Material Design 3 Theme**: The entire UI has been updated with a comprehensive, semantic color palette based on Material Design 3, configured in `tailwind.config.cjs`.

## 架構概觀

本專案為一個全端應用程式，基於 Nuxt 3 框架打造，充分利用其強大的伺服器端渲染 (SSR) 與 API 端點建立功能。

-   **前端 (Frontend)**：使用者介面採用 Vue 3 建構，並透過 `pages/` 目錄中的檔案結構來定義路由。這包括了主要的首頁 (`/`)、一個受保護的使用者個人想法頁面 (`/my-ideas`)，以及用於顯示特定提示詞內容的動態路由 (`/prompts/:id`)。可重用的 UI 元素，如導覽列、登入彈窗和報告容器，都被組織在 `components/` 目錄下的 Vue 元件中。專案的整體視覺風格由 Tailwind CSS 管理，並在 `tailwind.config.cjs` 中配置了自訂的 Material Design 3 色彩主題。

-   **後端 (Backend)**：後端邏輯被封裝在位於 `server/api/gemini.post.ts` 的單一無伺服器 API 路由中。此端點負責與 Google Gemini API 的所有通訊。它安全地處理 API 金鑰，接收來自客戶端的提示，為 AI 模型建構請求，並在將結果回傳給前端之前進行處理。

-   **資料庫 (Database)**：資料持久化由 Supabase 管理，它提供了一個 PostgreSQL 資料庫和自動生成的 API。資料庫的結構定義在 `types/database.types.ts` 中，其設計旨在儲存使用者資訊、提示、由 AI 生成的想法、詳細報告以及可執行的步驟。關鍵的資料表包括 `users`、`prompts`、`ideas`、`reports` 和 `steps`，它們以關聯式結構相互連結。

-   **身份驗證 (Authentication)**：使用者身份驗證是透過 `@nuxtjs/supabase` 模組處理，提供了與 Supabase Auth 的無縫整合，並支援 Google OAuth 以便於登入。`components/LoginModal.vue` 元件提供了身份驗證的使用者介面，而 `middleware/auth.js` 路由中介軟體則透過確保只有經過身份驗證的使用者才能存取，來保護特定於使用者的頁面。

## Quick Start

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Set Up Environment Variables**:
    You will need to set up credentials for both the Gemini API and Supabase.
    ```bash
    cp .env.example .env
    ```
    Fill in the required values in the newly created `.env` file. For detailed instructions, please refer to `GEMINI_API_KEY.md` and `SUPABASE_SETUP.md`.

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.