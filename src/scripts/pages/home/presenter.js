import L from 'leaflet';
import CONFIG from '../../config';
import NotificationHelper from '../../utils/notification-helper';

export default class HomePagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
        this._map = null;
        this._setupNotificationButton();
    }

    async getStories() {
        try {
            const stories = await this._model.getAllStories();
            this._view.showStories(stories);
            this._initializeMap(stories);
        } catch (error) {
            this._view.showError(error.message);
        }
    }

    _initializeMap(stories) {
        this._map = L.map('story-map').setView([-2.5489, 118.0149], 5); // Center of Indonesia

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
    _setupNotificationButton() {
        // Menunggu DOM siap sebelum menambahkan event listener
        document.addEventListener('DOMContentLoaded', () => {
            const subscribeButton = document.querySelector('#subscribeButton');
            if (subscribeButton) {
                subscribeButton.addEventListener('click', async () => {
                    await NotificationHelper.subscribe();
                });
            }
        });
    }
}