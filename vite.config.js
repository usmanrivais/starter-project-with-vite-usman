import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'; // <-- Import plugin
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      manifest: {
        name: 'Story App',
        short_name: 'StoryApp',
        description: 'Aplikasi berbagi cerita - Bagikan momen berhargamu.',
        theme_color: '#3498db',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/index.html',
        icons: [
          {
            src: '/images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: '/screenshots/screenshot-desktop-1.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Halaman Utama Aplikasi'
          },
          {
            src: '/screenshots/screenshot-mobile-1.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Halaman Utama di Mobile'
          }
        ],
        shortcuts: [
          {
            name: "Tambah Cerita Baru",
            url: "/#/add-story",
            description: "Buka halaman untuk menambahkan cerita baru",
            icons: [{ "src": "/images/icon-192x192.png", "sizes": "192x192" }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg}'],

        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'story-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
          {
            urlPattern: ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/images/stories/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'story-image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
});