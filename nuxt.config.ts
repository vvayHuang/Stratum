import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from 'nuxt/config'

const supabaseOrigin = process.env.SUPABASE_URL?.replace(/\/+$/, '') ?? ''
const supabaseSocket = supabaseOrigin.replace(/^https:/, 'wss:')

// 只在 production 套用 CSP：dev 的 HMR 需要 eval 與 ws://localhost。
const contentSecurityPolicy = [
  "default-src 'self'",
  // Nuxt 會 inline hydration script；Tailwind 與 GSAP 會寫入 inline style。
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // 使用者頭像來自 Google 的 CDN。
  "img-src 'self' data: blob: https:",
  ["connect-src 'self'", supabaseOrigin, supabaseSocket].filter(Boolean).join(' '),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  ...(process.env.NODE_ENV === 'production'
    ? { 'Content-Security-Policy': contentSecurityPolicy }
    : {}),
}

export default defineNuxtConfig({
  routeRules: {
    '/**': { headers: securityHeaders },
  },
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
