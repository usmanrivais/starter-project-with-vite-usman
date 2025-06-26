import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';

// Klaim kontrol atas klien (tab) secepat mungkin
self.skipWaiting();
clientsClaim();

// Atur nama cache kustom
setCacheNameDetails({
    prefix: 'story-app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime',
});

// Pre-caching App Shell. Daftar file akan disuntikkan oleh Workbox.
precacheAndRoute(self.__WB_MANIFEST);

// Aturan untuk runtime caching (data dinamis dari API)
// 1. Cache untuk data dari Story API
registerRoute(
    ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1/'),
    new StaleWhileRevalidate({
        cacheName: 'story-api-cache',
    })
);

// 2. Cache untuk gambar cerita
registerRoute(
    ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/images/stories/'),
    new CacheFirst({
        cacheName: 'story-image-cache',
        plugins: [
            {
                // Plugin untuk mengatur masa berlaku cache
                cacheWillUpdate: async ({ response }) => {
                    if (response && response.status === 200) {
                        return response;
                    }
                    return null;
                },
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Hari
            },
        ],
    })
);

// Listener untuk event 'push' untuk menangani notifikasi
self.addEventListener('push', (event) => {
    console.log('Service Worker: Menerima Push Notification.');

    const notificationData = event.data.json();
    const { title, options } = notificationData;

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});