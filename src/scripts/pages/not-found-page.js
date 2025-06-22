export default class NotFoundPage {
    async render() {
        return `
      <section class="container">
        <div class="form-container" style="text-align: center;">
          <h2>404 - Halaman Tidak Ditemukan</h2>
          <p style="font-size: 1.2rem; margin-top: 20px; line-height: 1.6;">
            Maaf, halaman yang Anda cari tidak ada.
          </p>
          <a href="#/" class="button" style="display:inline-block; width: auto; margin-top: 20px;">Kembali ke Beranda</a>
        </div>
      </section>
    `;
    }

    async afterRender() {
    }
}