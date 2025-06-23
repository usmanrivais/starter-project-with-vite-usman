import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'; // <-- Import plugin
import { resolve } from 'path';

// https://vitejs.dev/config/
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
  // --- TAMBAHKAN KONFIGURASI PLUGIN DI SINI ---
  plugins: [
    VitePWA({
      // Konfigurasi ini akan meng-generate file manifest.json untuk kita
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
        // Opsi dari kriteria opsional
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
      // Konfigurasi Workbox untuk Caching
      workbox: {
        // Aturan untuk pre-caching App Shell (file statis)
        globPatterns: ['**/*.{js,css,html,png,jpg}'],

        // Aturan untuk runtime caching (data dinamis dari API)
        runtimeCaching: [
          {
            // Aturan untuk caching data dari Story API
            urlPattern: ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1/'),
            handler: 'NetworkFirst', // Coba jaringan dulu, jika gagal baru ambil dari cache
            options: {
              cacheName: 'story-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 Minggu
              },
            },
          },
          {
            // Aturan untuk caching gambar cerita
            urlPattern: ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/images/stories/'),
            handler: 'CacheFirst', // Ambil dari cache dulu, jika tidak ada baru ke jaringan
            options: {
              cacheName: 'story-image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Hari
              },
            },
          },
        ],
      },
    }),
  ],
});