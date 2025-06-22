import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import AuthHelper from '../utils/auth-helper';
import NotificationHelper from '../utils/notification-helper';

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
    await this.#setupNotificationFeature(); // <-- PANGGIL FUNGSI BARU DI SINI

    const url = getActiveRoute();
    const page = routes[url] || routes['/not-found'];

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

  // --- METHOD BARU UNTUK LOGIKA NOTIFIKASI ---
  async #setupNotificationFeature() {
    // Tombol hanya akan berfungsi jika user sudah login
    if (!AuthHelper.isLoggedIn()) {
      // Sembunyikan tombol jika belum login
      const subscribeButtonContainer = document.querySelector('.nav-item-subscribe');
      if (subscribeButtonContainer) subscribeButtonContainer.style.display = 'none';
      return;
    }

    // Tampilkan tombol jika sudah login
    const subscribeButtonContainer = document.querySelector('.nav-item-subscribe');
    if (subscribeButtonContainer) subscribeButtonContainer.style.display = 'list-item';

    const subscribeButton = document.querySelector('#subscribeButton');
    if (!subscribeButton) return;

    const isSubscribed = await NotificationHelper.isSubscribed();
    this.#updateNotificationButtonUI(isSubscribed);

    if (!subscribeButton.hasAttribute('data-listener-added')) {
      subscribeButton.addEventListener('click', async () => {
        const currentState = await NotificationHelper.isSubscribed();
        if (currentState) {
          await NotificationHelper.unsubscribe();
        } else {
          await NotificationHelper.subscribe();
        }
        const newState = await NotificationHelper.isSubscribed();
        this.#updateNotificationButtonUI(newState);
      });
      subscribeButton.setAttribute('data-listener-added', 'true');
    }
  }

  #updateNotificationButtonUI(isSubscribed) {
    const subscribeButton = document.querySelector('#subscribeButton');
    const notificationIcon = document.querySelector('#notification-icon');
    const notificationText = document.querySelector('#notification-text');

    // Pastikan semua elemen ada sebelum mengubahnya
    if (!subscribeButton || !notificationIcon || !notificationText) return;

    if (isSubscribed) {
      subscribeButton.classList.add('subscribed');
      notificationIcon.className = 'fas fa-bell-slash'; // Ikon lonceng dicoret
      notificationText.textContent = 'Unsubscribe';
    } else {
      subscribeButton.classList.remove('subscribed');
      notificationIcon.className = 'fas fa-bell'; // Ikon lonceng normal
      notificationText.textContent = 'Subscribe';
    }
  }
}

export default App;