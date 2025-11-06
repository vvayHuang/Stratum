# Project Overview

This is a Nuxt.js v3 project bootstrapped from a Figma design. It uses Tailwind CSS for styling. The goal of the project is to provide a web interface based on the provided Figma design.

The project is structured as a standard Nuxt application:
- `pages/index.vue`: The main and only page.
- `components/`: Contains the Vue components `Navbar.vue`, `Hero.vue`, and `Cards.vue`.
- `assets/`: Contains static assets like SVG icons and the main `tailwind.css` file.
- `nuxt.config.ts`: The Nuxt configuration file, which sets up the Tailwind CSS module.
- `package.json`: Defines project scripts and dependencies.

# Building and Running

To get started with this project, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

4.  **Preview the production build:**
    ```bash
    npm run start
    ```

# Development Conventions

- **Styling:** The project uses Tailwind CSS. Utility classes should be used for styling directly in the Vue components. Global styles are defined in `assets/css/tailwind.css`.
- **Components:** The application is built using a component-based architecture. Reusable UI elements are defined as Vue components in the `components/` directory.
- **Structure:** The main page is `pages/index.vue`, which composes the overall layout from the components in the `components/` directory.
