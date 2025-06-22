import HomePagePresenter from './presenter';
import StoryApiSource from '../../data/story-api-source';
import createStoryItemTemplate from '../../views/templates/template-creator';
import AuthHelper from '../../utils/auth-helper';

export default class HomePage {
    constructor() {
        this._presenter = new HomePagePresenter({
            view: this,
            model: StoryApiSource,
        });
    }

    async render() {
        return `
      <section class="container">
        <h2>Daftar Cerita</h2>
        <div class="notification-subscribe">
          <button id="subscribeButton" class="button" style="width: auto; background-color: #2ecc71;">
            Berlangganan Notifikasi
          </button>
        </div>
        <div id="story-map" style="margin-top:20px;"></div>
        <div id="stories-list" class="loading">Memuat cerita...</div>
      </section>
    `;
    }

    async afterRender() {
        if (!AuthHelper.isLoggedIn()) {
            window.location.hash = '#/login';
            return;
        }
        await this._presenter.getStories();
    }

    showStories(stories) {
        const storiesContainer = document.querySelector('#stories-list');
        storiesContainer.innerHTML = '';
        stories.forEach((story) => {
            storiesContainer.innerHTML += createStoryItemTemplate(story);
        });
        storiesContainer.classList.remove('loading');
    }

    showError(message) {
        const storiesContainer = document.querySelector('#stories-list');
        storiesContainer.innerHTML = `Error: ${message}`;
        storiesContainer.classList.remove('loading');
    }
}