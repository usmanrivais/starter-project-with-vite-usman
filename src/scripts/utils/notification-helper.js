import StoryApiSource from '../data/story-api-source';
import AuthHelper from './auth-helper';

// Fungsi ini diperlukan untuk mengubah VAPID key menjadi format yang benar
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const NotificationHelper = {
    async subscribe() {
        if (!('PushManager' in window)) {
            alert('Browser ini tidak mendukung Push Notification.');
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                alert('Izin notifikasi tidak diberikan.');
                return;
            }

            const serviceWorker = await navigator.serviceWorker.ready;
            const vapidPublicKey = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
            const subscription = await serviceWorker.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            // Kirim subscription ke server
            await this.sendSubscriptionToServer(subscription);
            alert('Berhasil berlangganan notifikasi!');

        } catch (error) {
            console.error('Gagal berlangganan notifikasi:', error);
            alert('Gagal berlangganan notifikasi. Silakan coba lagi.');
        }
    },

    async sendSubscriptionToServer(subscription) {
        const subscriptionData = subscription.toJSON();
        const dataToSend = {
            endpoint: subscriptionData.endpoint,
            keys: {
                p256dh: subscriptionData.keys.p256dh,
                auth: subscriptionData.keys.auth
            }
        };

        // Ini adalah endpoint API yang perlu Anda panggil
        // Anda perlu memastikan StoryApiSource memiliki metode untuk ini
        // Untuk saat ini, kita akan buat panggilannya di sini
        await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthHelper.getToken()}`
            },
            body: JSON.stringify(dataToSend)
        });
    },
};

export default NotificationHelper;