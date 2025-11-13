# Project Overview

This is a Nuxt.js v3 project bootstrapped from a Figma design. It uses Tailwind CSS for styling and GSAP for animations. The goal of the project is to provide a web interface that allows users to get career advice based on their interests, using the Google Gemini API.

The project now integrates **Supabase** for user authentication (via Google OAuth) and database storage.

The project is structured as a standard Nuxt application:
- `pages/index.vue`: The main and only page, which handles the main layout and API calls.
- `components/`: Contains the Vue components `Navbar.vue`, `Hero.vue`, `Cards.vue`, and `LoginModal.vue`.
- `server/api/gemini.post.ts`: The server-side API route that communicates with the Gemini API and saves interactions to the database.
- `nuxt.config.ts`: The Nuxt configuration file, which sets up the Tailwind and Supabase modules.
- `SUPABASE_SETUP.md`: A detailed guide for setting up the Supabase project and database schema.
- **Database Tables**: The project uses two main tables in Supabase: `users` (for user profile data) and `user_interactions` (to store user prompts and Gemini responses).

# Building and Running

To get started with this project, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Supabase:**
    - Refer to `SUPABASE_SETUP.md` for detailed instructions on how to create a Supabase project, set up Google Authentication, and get the required API keys.

3.  **Set up your environment variables:**
    - Create a `.env` file in the root of the project.
    - Add the following variables, filling in the values from your Gemini and Supabase projects:
      ```
      GEMINI_API_KEY="your_gemini_api_key"
      SUPABASE_URL="your_supabase_project_url"
      SUPABASE_KEY="your_supabase_anon_public_key"
      SUPABASE_SERVICE_KEY="your_supabase_service_role_key"
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

6.  **Preview the production build:**
    ```bash
    npm run start
    ```

# Development Conventions

- **Styling:** The project uses Tailwind CSS. Utility classes should be used for styling directly in the Vue components.
- **Authentication:** Authentication is handled by the `@nuxtjs/supabase` module. UI components like `Navbar.vue` and `LoginModal.vue` use composables (`useSupabaseUser`, `useSupabaseClient`) to manage user state and actions.

# API Integration & Database

The project is integrated with the Google Gemini API and uses Supabase for data persistence.

- **Authentication:** Users sign in via Google OAuth, managed by Supabase. When a new user signs up, a database trigger automatically creates a corresponding entry in the public `users` table.
- **Gemini API Call:** The `server/api/gemini.post.ts` route handles requests from the frontend.
  - It first verifies that the user is authenticated using `serverSupabaseUser`.
  - It then calls the Gemini API to get career advice based on the user's prompt.
- **Database Storage:** After receiving a successful response from Gemini, the API route uses a Supabase admin client (with the `service_role` key) to save the interaction to the `user_interactions` table. This includes the user's ID (`sub`), the original prompt, and the response from Gemini. Using the service role key allows the server to bypass Row Level Security for this trusted operation.

# Animations

The project uses the GSAP library for animations to enhance user experience.
- **Hero Component (`components/Hero.vue`):** Animates out when a prompt is submitted.
- **Cards Component (`components/Cards.vue`):** Animates out along with the Hero component.
- **Prompt Layout (`components/PromptLayout.vue`):** Fades in to show the loading state and then the results.