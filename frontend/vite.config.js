// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/ecommerce-project/', // ✅ MUST match your GitHub repo name
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'MyShop',
        short_name: 'MyShop',
        description: 'A fast eCommerce store built with React',
        theme_color: '#7e22ce',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/ecommerce-project/', // ✅ Ensure this is relative to base
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
