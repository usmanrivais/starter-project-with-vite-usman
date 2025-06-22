import RegisterPagePresenter from './presenter';
import StoryApiSource from '../../data/story-api-source';

export default class RegisterPage {
    constructor() {
        this._presenter = new RegisterPagePresenter({
            view: this,
            model: StoryApiSource,
        });
    }

    async render() {
        return `
      <section class="container">
        <div class="form-container">
          <h2>Registrasi Akun Baru</h2>
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Nama</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password (min. 8 karakter)</label>
              <input type="password" id="password" name="password" required minlength="8">
            </div>
            <button type="submit" id="submit-button" class="button">Daftar</button>
            <p class="mt-3">Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </form>
          <div id="error-message" class="error-message" style="color: red; margin-top: 10px;"></div>
        </div>
      </section>
    `;
    }

    async afterRender() {
        this._presenter.initializeForm();
    }

    getRegisterData() {
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        return { name, email, password };
    }

    showLoading() {
        document.querySelector('#submit-button').innerText = 'Memproses...';
        document.querySelector('#submit-button').disabled = true;
        document.querySelector('#error-message').innerText = '';
    }

    showError(message) {
        document.querySelector('#error-message').innerText = message;
        document.querySelector('#submit-button').innerText = 'Daftar';
        document.querySelector('#submit-button').disabled = false;
    }

    showSuccessMessage() {
        alert('Registrasi berhasil! Silakan login dengan akun Anda.');
        window.location.hash = '#/login';
    }
}