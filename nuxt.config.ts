import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Figma Export - SideBling'
    }
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY
  }
})
