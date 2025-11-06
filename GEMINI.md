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
    - Create a `.env` file in the root of the project.
    - Add your Gemini API key to the `.env` file as follows:
      ```
      GEMINI_API_KEY=your-api-key-here
      ```

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

The project is integrated with the Google Gemini API to provide career advice based on user input. The integration is handled by a server-side API route located at `server/api/gemini.post.ts`. This route takes a user's prompt, communicates with the Gemini API, and returns the generated response.

The API key is managed through a `.env` file and exposed to the server-side of the Nuxt application via the `runtimeConfig` in `nuxt.config.ts`.

# Animations

The project uses the GSAP library for animations.

- **Hero Component (`components/Hero.vue`):** When the CTA button is clicked, the hero component (input and button) animates down and fades out. A loader is displayed within the Hero component while waiting for the API response.
- **Cards Component (`components/Cards.vue`):** When the CTA button is clicked, the cards animate out of view with a stagger effect.
- **Loader (`pages/index.vue`):** A prominent loader with text and a GSAP fade-in animation is displayed in the main page while the API call is in progress.

Both the Hero and Cards animations are triggered simultaneously from the `pages/index.vue` component.
