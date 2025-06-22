self.addEventListener('install', (event) => {
    console.log('Service Worker: Menginstall...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Aktif.');
});

self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Mengambil data ', event.request.url);
});

self.addEventListener('push', (event) => {
    console.log('Service Worker: Menerima Push Notification.');

    const notificationData = event.data.json(); // Ambil data notifikasi
    const { title, options } = notificationData;

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});