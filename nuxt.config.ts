import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      title: 'Figma Export - SideBling'
    }
  },
  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY
  },
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: 'authjs'
    }
  }
})
