import StoryIdb from '../../data/story-idb';
import NotificationHelper from '../../utils/notification-helper'; // <-- Import statis

export default class HomePagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
        this._stories = [];
        this._setupSaveListener();
    }

    async getStories() {
        await this._setupNotificationFeature(); // Panggil fungsi notifikasi
        try {
            const stories = await this._model.getAllStories();
            this._stories = stories;
            this._view.showStories(stories);
            this._view.initializeMap(stories);
        } catch (error) {
            this._view.showError(error.message);
        }
    }

    _setupSaveListener() {
        document.body.addEventListener('click', async (event) => {
            const saveButton = event.target.closest('.button-save');
            if (saveButton) {
                event.stopPropagation();
                const storyId = saveButton.dataset.id;
                const storyToSave = this._stories.find(story => story.id === storyId);
                if (storyToSave) {
                    const existingStory = await StoryIdb.getStory(storyId);
                    if (existingStory) {
                        alert('Cerita ini sudah ada di favorit Anda.');
                    } else {
                        await StoryIdb.putStory(storyToSave);
                        alert('Cerita berhasil disimpan ke favorit!');
                    }
                }
            }
        });
    }

    // --- LOGIKA NOTIFIKASI YANG DISESUAIKAN ---
    async _setupNotificationFeature() {
        const subscribeButton = document.querySelector('#subscribeButton');
        if (!subscribeButton) return;
        // Pengecekan isLoggedIn sudah dilakukan di app.js, jadi di sini kita hanya pasang listener
        if (!subscribeButton.hasAttribute('data-listener-added')) {
            subscribeButton.addEventListener('click', async () => {
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
        // Logika ini dipindahkan sepenuhnya ke app.js
        // Namun kita biarkan di sini untuk dipanggil dari listener
        const subscribeButton = document.querySelector('#subscribeButton');
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