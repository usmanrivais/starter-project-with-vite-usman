import FavoritesPagePresenter from './presenter';
import StoryIdb from '../../data/story-idb';

export default class FavoritesPage {
    constructor() {
        this._presenter = new FavoritesPagePresenter({
            view: this,
            model: StoryIdb,
        });
    }

    async render() {
        return `
      <section class="container">
        <h2>Cerita Favorit Anda</h2>
        <div id="favorite-stories-list"></div>
      </section>
    `;
    }

    async afterRender() {
        await this._presenter.getFavoriteStories();
    }

    showStories(stories) {
        const storiesContainer = document.querySelector('#favorite-stories-list');
        if (stories.length > 0) {
            storiesContainer.innerHTML = '';
            stories.forEach((story) => {
                // Kita akan buat template khusus untuk favorit nanti
                storiesContainer.innerHTML += this._createFavoriteStoryItemTemplate(story);
            });
        } else {
            storiesContainer.innerHTML = '<p class="loading">Anda belum memiliki cerita favorit.</p>';
        }
    }

    _createFavoriteStoryItemTemplate(story) {
        return `
      <article class="story-item">
        <img class="story-item__image" src="${story.photoUrl}" alt="Cerita oleh ${story.name}">
        <div class="story-item__content">
          <h3 class="story-item__title">${story.name}</h3>
          <p class="story-item__description">${story.description}</p>
          <button class="button-delete" data-id="${story.id}">Hapus dari Favorit</button>
        </div>
      </article>
    `;
    }
}