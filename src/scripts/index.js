// CSS imports
import '../styles/styles.css';
import App from './pages/app';

const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Registrasi Service Worker berhasil:', registration);
    } catch (error) {
      console.error('Registrasi Service Worker gagal:', error);
    }
  } else {
    console.log('Browser tidak mendukung Service Worker.');
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  await registerServiceWorker();

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  await app.renderPage();
});