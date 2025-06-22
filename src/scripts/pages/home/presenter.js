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
        // Panggil setup notifikasi di sini, karena method ini dijamin
        // berjalan setelah halaman di-render (dari afterRender di View)
        this._setupNotificationButton();

        try {
            const stories = await this._model.getAllStories();
            this._view.showStories(stories);
            this._initializeMap(stories);
        } catch (error) {
            this._view.showError(error.message);
        }
    }

    _initializeMap(stories) {
        // Cek jika map sudah diinisialisasi
        if (this._map) {
            this._map.remove();
        }
        this._map = L.map('story-map').setView([-2.5489, 118.0149], 5);

        L.tileLayer(CONFIG.MAP_TILE_URL, {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
            apiKey: CONFIG.MAP_API_KEY
        }).addTo(this._map);

        stories.forEach(story => {
            if (story.lat && story.lon) {
                L.marker([story.lat, story.lon]).addTo(this._map)
                    .bindPopup(`<b>${story.name}</b><br>${story.description.substring(0, 30)}...`);
            }
        });
    }

    // --- METHOD YANG DIPERBAIKI ---
    _setupNotificationButton() {
        const subscribeButton = document.querySelector('#subscribeButton');

        // Periksa jika tombol sudah ada event listener untuk mencegah duplikasi
        if (subscribeButton && !subscribeButton.hasAttribute('data-listener-added')) {
            subscribeButton.addEventListener('click', async () => {
                await NotificationHelper.subscribe();
            });
            subscribeButton.setAttribute('data-listener-added', 'true');
        }
    }
}
