import L from 'leaflet';
import CONFIG from '../../config';
import StoryIdb from '../../data/story-idb';

export default class HomePagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
        this._map = null;
        this._stories = [];
        this._setupSaveListener();
    }

    async getStories() {
        this._setupNotificationFeature();

        try {
            const stories = await this._model.getAllStories();
            this._stories = stories; // Simpan data
            this._view.showStories(stories);
            this._initializeMap(stories);
        } catch (error) {
            this._view.showError(error.message);
        }
    }

    _setupSaveListener() {
        document.body.addEventListener('click', async (event) => {
            if (event.target.classList.contains('button-save')) {
                event.stopPropagation();
                const storyId = event.target.dataset.id;
                const storyToSave = this._stories.find(story => story.id === storyId);
                if (storyToSave) {
                    await StoryIdb.putStory(storyToSave);
                    alert('Cerita berhasil disimpan ke favorit!');
                }
            }
        });
    }

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