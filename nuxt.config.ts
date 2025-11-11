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
    geminiApiKey: process.env.GEMINI_API_KEY
  },
  auth: {
    isEnabled: false,
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    }
  }
})
