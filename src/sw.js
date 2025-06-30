import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

self.skipWaiting();
clientsClaim();

setCacheNameDetails({
    prefix: 'story-app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime',
});

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/v1/'),
    new StaleWhileRevalidate({
        cacheName: 'story-api-cache',
    })
);

registerRoute(
    ({ url }) => url.href.startsWith('https://story-api.dicoding.dev/images/stories/'),
    new CacheFirst({
        cacheName: 'story-image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Hari
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

self.addEventListener('push', (event) => {
    console.log('Service Worker: Menerima Push Notification.');
    const notificationData = event.data.json();
    const { title, options } = notificationData;
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});