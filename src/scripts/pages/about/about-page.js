export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <div class="form-container" style="text-align: center;">
          <h2>About This App</h2>
          <p style="font-size: 1.2rem; margin-top: 20px; line-height: 1.6;">
            Aplikasi ini dibuat dengan segenap jiwa dan raga semoga tembus aamiin
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
  }
}