import L from 'leaflet';
import CONFIG from '../../config';
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

    initializeMap(stories) {
        const mapElement = document.getElementById('story-map');
        if (mapElement.hasAttribute('_leaflet_id')) {
            mapElement._leaflet_id = null;
        }

        const map = L.map('story-map').setView([-2.5489, 118.0149], 5);
        L.tileLayer(CONFIG.MAP_TILE_URL, {
            maxZoom: 19, attribution: '© OpenStreetMap contributors', apiKey: CONFIG.MAP_API_KEY
        }).addTo(map);

        stories.forEach(story => {
            if (story.lat && story.lon) {
                L.marker([story.lat, story.lon]).addTo(map)
                    .bindPopup(`<b>${story.name}</b><br>${story.description.substring(0, 30)}...`);
            }
        });
    }
}