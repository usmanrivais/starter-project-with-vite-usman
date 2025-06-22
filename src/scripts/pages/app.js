import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import AuthHelper from '../utils/auth-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
          !this.#navigationDrawer.contains(event.target) &&
          !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _updateLoginLogoutButton() {
    const loginLogoutButton = document.querySelector('#login-logout-button');
    if (AuthHelper.isLoggedIn()) {
      loginLogoutButton.textContent = 'Logout';
      loginLogoutButton.href = '#/login';
      loginLogoutButton.onclick = (e) => {
        e.preventDefault();
        AuthHelper.removeToken();
        this._updateLoginLogoutButton();
        window.location.hash = '#/login';
      };
    } else {
      loginLogoutButton.textContent = 'Login';
      loginLogoutButton.href = '#/login';
      loginLogoutButton.onclick = null;
    }
  }

  async renderPage() {
    this._updateLoginLogoutButton();
    const url = getActiveRoute();
    const page = routes[url] || routes['/'];

    // View Transition API
    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }

    const cameraHelper = (await import('../utils/camera-helper')).default;
    cameraHelper.stopCameraStream();
  }
}

export default App;