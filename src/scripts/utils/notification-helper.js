import AuthHelper from './auth-helper';

// Fungsi urlBase64ToUint8Array tetap sama
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const NotificationHelper = {
    // FUNGSI BARU: Untuk mengecek status langganan
    async isSubscribed() {
        const serviceWorker = await navigator.serviceWorker.ready;
        const subscription = await serviceWorker.pushManager.getSubscription();
        return subscription !== null;
    },

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
            await this._sendSubscriptionToServer(subscription);
            console.log('Berhasil berlangganan notifikasi!');
        } catch (error) {
            console.error('Gagal berlangganan notifikasi:', error);
            alert('Gagal berlangganan notifikasi.');
        }
    },

    // FUNGSI BARU: Untuk berhenti berlangganan
    async unsubscribe() {
        try {
            const serviceWorker = await navigator.serviceWorker.ready;
            const subscription = await serviceWorker.pushManager.getSubscription();
            if (subscription) {
                // Kirim permintaan unsubscribe ke server terlebih dahulu
                await this._sendUnsubscriptionToServer(subscription);
                // Kemudian batalkan langganan dari sisi browser
                await subscription.unsubscribe();
                console.log('Berhasil berhenti berlangganan notifikasi!');
            }
        } catch (error) {
            console.error('Gagal berhenti berlangganan:', error);
            alert('Gagal berhenti berlangganan.');
        }
    },

    // Method untuk mengirim data subscribe
    async _sendSubscriptionToServer(subscription) {
        const subscriptionData = subscription.toJSON();
        const dataToSend = {
            endpoint: subscriptionData.endpoint,
            keys: { p256dh: subscriptionData.keys.p256dh, auth: subscriptionData.keys.auth }
        };
        await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthHelper.getToken()}`
            },
            body: JSON.stringify(dataToSend)
        });
    },

    // Method untuk mengirim data unsubscribe
    async _sendUnsubscriptionToServer(subscription) {
        const subscriptionData = subscription.toJSON();
        await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthHelper.getToken()}`
            },
            body: JSON.stringify({ endpoint: subscriptionData.endpoint })
        });
    },
};

export default NotificationHelper;