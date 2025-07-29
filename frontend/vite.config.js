// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/ecommerce-project/', // ✅ Match GitHub repo name exactly
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.png',
        'robots.txt',
        'icon-192.png',
        'icon-512.png',
      ],
      manifest: {
        name: 'MyShop',
        short_name: 'MyShop',
        description: 'A fast eCommerce store built with React',
        theme_color: '#7e22ce',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/ecommerce-project/',
        scope: '/ecommerce-project/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
