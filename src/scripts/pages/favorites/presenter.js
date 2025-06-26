export default class FavoritesPagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
        this._setupDeleteListeners();
    }

    async getFavoriteStories() {
        const stories = await this._model.getAllStories();
        this._view.showStories(stories);
    }

    _setupDeleteListeners() {
        document.body.addEventListener('click', async (event) => {
            if (event.target.classList.contains('button-delete')) {
                const storyId = event.target.dataset.id;
                await this._model.deleteStory(storyId);
                alert('Cerita dihapus dari favorit!');
                // Re-render halaman untuk memperbarui daftar
                await this.getFavoriteStories();
            }
        });
    }
}