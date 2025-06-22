import LoginPagePresenter from './presenter';
import StoryApiSource from '../../data/story-api-source';
import AuthHelper from '../../utils/auth-helper';

export default class LoginPage {
    constructor() {
        this._presenter = new LoginPagePresenter({
            view: this,
            model: StoryApiSource,
        });
    }

    async render() {
        return `
      <section class="container">
        <div class="form-container">
          <h2>Login</h2>
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit" id="submit-button" class="button">Login</button>
            <p class="mt-3">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </form>
          <div id="error-message" class="error-message" style="color: red; margin-top: 10px;"></div>
        </div>
      </section>
    `;
    }

    async afterRender() {
        // Jika sudah login, langsung arahkan ke halaman utama
        if (AuthHelper.isLoggedIn()) {
            window.location.hash = '#/';
            return;
        }
        this._presenter.initializeForm();
    }

    getLoginData() {
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        return { email, password };
    }

    showLoading() {
        document.querySelector('#submit-button').innerText = 'Memproses...';
        document.querySelector('#submit-button').disabled = true;
        document.querySelector('#error-message').innerText = '';
    }

    showError(message) {
        document.querySelector('#error-message').innerText = message;
        document.querySelector('#submit-button').innerText = 'Login';
        document.querySelector('#submit-button').disabled = false;
    }

    loginSuccess(token) {
        AuthHelper.setToken(token);
        window.location.hash = '#/';
    }
}