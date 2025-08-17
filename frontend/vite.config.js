import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ecommerce-project/', // ✅ GitHub Pages base path
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'MyShop',
        short_name: 'Shop',
        start_url: '/ecommerce-project/',
        display: 'standalone',
        background_color: '#ffffff',
        description: 'PWA Ecommerce App',
        icons: [
          {
            src: '/ecommerce-project/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/ecommerce-project/pwa-512x512.png',
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
  }
})
