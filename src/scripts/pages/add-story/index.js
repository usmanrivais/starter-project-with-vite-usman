import AddStoryPresenter from './presenter';
import StoryApiSource from '../../data/story-api-source';
import CameraHelper from '../../utils/camera-helper';
import LocationHelper from '../../utils/location-helper';
import AuthHelper from '../../utils/auth-helper';

export default class AddStoryPage {
    constructor() {
        this._presenter = new AddStoryPresenter({
            view: this,
            model: StoryApiSource,
        });
        this._photo = null;
    }

    async render() {
        return `
      <section class="container">
        <div class="form-container">
          <h2>Tambah Cerita Baru</h2>
          <form id="addStoryForm">
            <div class="form-group">
              <label for="description">Deskripsi</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            
            <div class="camera-container">
              <h3>Ambil Foto</h3>
              <video id="video-preview" autoplay muted playsinline></video>
              <canvas id="canvas-preview" style="display:none;"></canvas>
              <img id="image-preview" src="#" alt="Pratinjau gambar" style="display:none;" />
              <button type="button" id="start-camera-button" class="button">Buka Kamera</button>
              <button type="button" id="capture-button" class="button" style="display:none;">Ambil Gambar</button>
            </div>

            <div class="location-picker">
              <h3>Pilih Lokasi (Klik pada Peta)</h3>
              <div id="location-map"></div>
              <input type="hidden" id="latitude" name="lat">
              <input type="hidden" id="longitude" name="lon">
            </div>

            <button type="submit" id="submit-button" class="button">Kirim Cerita</button>
          </form>
        </div>
      </section>
    `;
    }

    async afterRender() {
        if (!AuthHelper.isLoggedIn()) {
            window.location.hash = '#/login';
            return;
        }
        this._presenter.initializeForm();
    }

    getFormData() {
        const description = document.querySelector('#description').value;
        const lat = document.querySelector('#latitude').value;
        const lon = document.querySelector('#longitude').value;
        return { description, photo: this._photo, lat, lon };
    }

    setPhoto(blob) {
        this._photo = blob;
    }

    showLoading() {
        document.querySelector('#submit-button').innerText = 'Mengirim...';
        document.querySelector('#submit-button').disabled = true;
    }

    showSuccess() {
        alert('Cerita berhasil ditambahkan!');
        CameraHelper.stopCameraStream();
        window.location.hash = '#/';
    }

    showError(message) {
        alert(`Error: ${message}`);
        document.querySelector('#submit-button').innerText = 'Kirim Cerita';
        document.querySelector('#submit-button').disabled = false;
    }
}