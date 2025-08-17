// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ecommerce-project/', // ✅ Required for GitHub Pages
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'MyShop',
        short_name: 'Shop',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        description: 'PWA Ecommerce App',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://ecommerce-project-production-28e7.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
