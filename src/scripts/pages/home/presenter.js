import L from 'leaflet';
import CONFIG from '../../config';
import NotificationHelper from '../../utils/notification-helper';

export default class HomePagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
        this._map = null;
    }

    async getStories() {
        // Panggil setup notifikasi di sini
        await this._setupNotificationFeature();

        try {
            const stories = await this._model.getAllStories();
            this._view.showStories(stories);
            this._initializeMap(stories);
        } catch (error) {
            this._view.showError(error.message);
        }
    }

    // ... (method _initializeMap tetap sama) ...
    _initializeMap(stories) {
        if (this._map) this._map.remove();
        this._map = L.map('story-map').setView([-2.5489, 118.0149], 5);
        L.tileLayer(CONFIG.MAP_TILE_URL, {
            maxZoom: 19, attribution: '© OpenStreetMap contributors', apiKey: CONFIG.MAP_API_KEY
        }).addTo(this._map);
        stories.forEach(story => {
            if (story.lat && story.lon) {
                L.marker([story.lat, story.lon]).addTo(this._map)
                    .bindPopup(`<b>${story.name}</b><br>${story.description.substring(0, 30)}...`);
            }
        });
    }

    // --- LOGIKA NOTIFIKASI YANG DIPERBARUI ---
    async _setupNotificationFeature() {
        const subscribeButton = document.querySelector('#subscribeButton');
        if (!subscribeButton) return;

        // Cek status langganan saat ini dan perbarui UI
        const isSubscribed = await NotificationHelper.isSubscribed();
        this._updateNotificationButtonUI(isSubscribed);

        // Tambahkan event listener sekali saja
        if (!subscribeButton.hasAttribute('data-listener-added')) {
            subscribeButton.addEventListener('click', async () => {
                const currentState = await NotificationHelper.isSubscribed();
                if (currentState) {
                    await NotificationHelper.unsubscribe();
                } else {
                    await NotificationHelper.subscribe();
                }
                // Perbarui UI lagi setelah aksi
                const newState = await NotificationHelper.isSubscribed();
                this._updateNotificationButtonUI(newState);
            });
            subscribeButton.setAttribute('data-listener-added', 'true');
        }
    }

    _updateNotificationButtonUI(isSubscribed) {
        const subscribeButton = document.querySelector('#subscribeButton');
        if (!subscribeButton) return;

        if (isSubscribed) {
            subscribeButton.textContent = 'Berhenti Berlangganan';
            subscribeButton.style.backgroundColor = '#e74c3c'; // Warna merah
        } else {
            subscribeButton.textContent = 'Berlangganan Notifikasi';
            subscribeButton.style.backgroundColor = '#2ecc71'; // Warna hijau
        }
    }
}