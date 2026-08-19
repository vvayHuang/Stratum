import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Stratum - Career Insights',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      ]
    }
  },
  nitro: {
    compatibilityDate: '2025-12-12'
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@paper-design/shaders',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'gsap',
      ]
    }
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    supabaseUrl: process.env.SUPABASE_URL, // Expose URL here for server-side access
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false
  },
  googleFonts: {
    families: {
      'DM Serif Display': true,
      'Roboto': true,
      'Material Symbols Outlined': true
    }
  }
})
