# SideBling - AI Career Advisor

This is a Nuxt.js v3 project that serves as an AI-powered career advisor. It leverages the Google Gemini API to generate creative career ideas based on user interests. The project uses Tailwind CSS for styling, GSAP for animations, and is integrated with Supabase for user authentication (Google OAuth) and database storage.

## Key Features

- **AI-Powered Suggestions**: Enter a hobby or interest, and the Gemini API will generate three potential career paths.
- **Detailed Guides**: Select an idea to generate a full step-by-step guide, including earnings potential and a competitive score.
- **Supabase Integration**: Handles user accounts, Google OAuth, and persists all user interactions, ideas, and generated guides in a PostgreSQL database.
- **Public Showcase**: The homepage features a running carousel of prompts submitted by all users, allowing for idea discovery even without logging in.
- **Material Design 3 Theme**: The entire UI has been updated with a comprehensive, semantic color palette based on Material Design 3, configured in `tailwind.config.cjs`.

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