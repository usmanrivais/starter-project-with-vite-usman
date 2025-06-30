import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  // Tidak ada 'root'
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'), // Menunjuk ke index.html di root
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
        start_url: '/',
        icons: [
          { src: '/images/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/images/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        screenshots: [
          { src: '/screenshots/screenshot-desktop-1.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'Halaman Utama Aplikasi' },
          { src: '/screenshots/screenshot-mobile-1.png', sizes: '540x720', type: 'image/png', form_factor: 'narrow', label: 'Halaman Utama di Mobile' }
        ],
        shortcuts: [
          { name: "Tambah Cerita Baru", url: "/#/add-story", description: "Buka halaman untuk menambahkan cerita baru", icons: [{ "src": "/images/icon-192x192.png", "sizes": "192x192" }] }
        ]
      },
      // --- KONFIGURASI FINAL UNTUK SERVICE WORKER ---
      strategies: 'injectManifest',
      srcDir: 'src',       // Direktori sumber sw.js adalah 'src'
      filename: 'sw.js',   // Nama filenya adalah 'sw.js'
    }),
  ],
});