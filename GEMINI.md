# Project Overview

This is a Nuxt.js v3 project bootstrapped from a Figma design. It uses Tailwind CSS for styling and GSAP for animations. The goal of the project is to provide a web interface that allows users to get career advice based on their interests, using the Google Gemini API.

The project is structured as a standard Nuxt application:
- `pages/index.vue`: The main and only page, which handles the main layout and API calls.
- `components/`: Contains the Vue components `Navbar.vue`, `Hero.vue`, and `Cards.vue`.
- `assets/`: Contains static assets like SVG icons and the main `tailwind.css` file.
- `server/api/gemini.post.ts`: The server-side API route that communicates with the Gemini API.
- `nuxt.config.ts`: The Nuxt configuration file, which sets up the Tailwind CSS module and runtime configuration for the API key.
- `package.json`: Defines project scripts and dependencies.

# Building and Running

To get started with this project, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up your API key:**
    - Refer to `GEMINI_API_KEY.md` for detailed instructions on how to obtain and configure your Gemini API key.

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

5.  **Preview the production build:**
    ```bash
    npm run start
    ```

# Development Conventions

- **Styling:** The project uses Tailwind CSS. Utility classes should be used for styling directly in the Vue components. Global styles are defined in `assets/css/tailwind.css`.
- **Components:** The application is built using a component-based architecture. Reusable UI elements are defined as Vue components in the `components/` directory.
- **Structure:** The main page is `pages/index.vue`, which composes the overall layout from the components in the `components/` directory.

# API Integration

The project is integrated with the Google Gemini API to provide career advice based on user input.
- The integration is handled by a server-side API route located at `server/api/gemini.post.ts`. This route uses the `@google/generative-ai` SDK to communicate with the Gemini API.
- The API takes a user's prompt, sends it to the `gemini-2.5-flash` model (or other configured model), and returns the generated response. The prompt to the Gemini API is designed to be strict, ensuring a clean, parsable list of job titles and descriptions.
- The API key is managed through a `.env` file and exposed to the server-side of the Nuxt application via the `runtimeConfig` in `nuxt.config.ts`.

# Animations

The project uses the GSAP library for animations to enhance user experience.

- **Hero Component (`components/Hero.vue`):**
    - When the CTA button is clicked, the hero component (input field, its label, and the button) animates downwards and fades out with a slight stagger effect.
    - The parent container of the Hero component now has `overflow: hidden` to ensure the animation is clipped correctly.
    - A `resetAnimation` function is available to restore the Hero component's initial state when a new search is initiated.
- **Cards Component (`components/Cards.vue`):**
    - When the CTA button is clicked, the cards animate out of view with a stagger effect (0.1 seconds delay).
    - The cards container has `overflow: hidden` to clip the animation.
- **Prompt Layout (`components/PromptLayout.vue`):**
    - The `PromptLayout` component now displays a loader (spinner with "Loading..." text) when waiting for the Gemini API response.
    - The user's input prompt text is hidden during the loading state and displayed once results are available.
    - The prompt text is now centered.
- **Overall Animation Flow:**
    - Both the Hero and Cards animations are triggered simultaneously from the `pages/index.vue` component.
    - The loading state (displaying `PromptLayout` with its loader) is activated only *after* the Hero and Cards animations have completed, ensuring a smooth transition and preventing animations from being obscured.