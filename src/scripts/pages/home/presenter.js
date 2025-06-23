import L from 'leaflet';
import CONFIG from '../../config';
import StoryIdb from '../../data/story-idb'; // <-- IMPORT BARU

export default class HomePagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model; // Model tetap merujuk ke StoryApiSource
        this._map = null;
    }

    // --- METHOD getStories SEKARANG MENGGUNAKAN STRATEGI OFFLINE-FIRST ---
    async getStories() {
        this._setupNotificationFeature(); // Panggil setup notifikasi

        try {
            // 1. Ambil data dari IndexedDB terlebih dahulu untuk ditampilkan
            const storiesFromIdb = await StoryIdb.getAllStories();
            if (storiesFromIdb.length > 0) {
                console.log('Menampilkan data dari IndexedDB');
                this._view.showStories(storiesFromIdb);
                this._initializeMap(storiesFromIdb);
            }

            // 2. Ambil data baru dari API
            console.log('Mengambil data baru dari API...');
            const storiesFromApi = await this._model.getAllStories();

            // 3. Simpan data baru ke IndexedDB
            await StoryIdb.putAllStories(storiesFromApi);

            // 4. Tampilkan data baru dari API
            console.log('Menampilkan data dari API & memperbarui IndexedDB');
            this._view.showStories(storiesFromApi);
            this._initializeMap(storiesFromApi);

        } catch (error) {
            console.error('Gagal mengambil data dari API, menampilkan data dari IndexedDB jika ada.', error);
            // Jika fetch API gagal, data dari IndexedDB (jika ada) sudah ditampilkan
            const storiesFromIdb = await StoryIdb.getAllStories();
            if (storiesFromIdb.length < 1) {
                // Jika di IndexedDB juga tidak ada data, tampilkan error
                this._view.showError(error.message);
            }
        }
    }

    // ... (sisa kode _initializeMap dan _setupNotificationFeature tetap sama) ...
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

    async _setupNotificationFeature() {
        const subscribeButton = document.querySelector('#subscribeButton');
        if (!subscribeButton) return;
        const isSubscribed = await (await import('../../utils/notification-helper')).default.isSubscribed();
        this._updateNotificationButtonUI(isSubscribed);
        if (!subscribeButton.hasAttribute('data-listener-added')) {
            subscribeButton.addEventListener('click', async () => {
                const NotificationHelper = (await import('../../utils/notification-helper')).default;
                const currentState = await NotificationHelper.isSubscribed();
                if (currentState) {
                    await NotificationHelper.unsubscribe();
                } else {
                    await NotificationHelper.subscribe();
                }
                const newState = await NotificationHelper.isSubscribed();
                this._updateNotificationButtonUI(newState);
            });
            subscribeButton.setAttribute('data-listener-added', 'true');
        }
    }

    _updateNotificationButtonUI(isSubscribed) {
        const subscribeButton = document.querySelector('#subscribeButton');
        if (!subscribeButton) return;
        const notificationIcon = document.querySelector('#notification-icon');
        const notificationText = document.querySelector('#notification-text');
        if (!subscribeButton || !notificationIcon || !notificationText) return;
        if (isSubscribed) {
            subscribeButton.classList.add('subscribed');
            notificationIcon.className = 'fas fa-bell-slash';
            notificationText.textContent = 'Unsubscribe';
        } else {
            subscribeButton.classList.remove('subscribed');
            notificationIcon.className = 'fas fa-bell';
            notificationText.textContent = 'Subscribe';
        }
    }
}