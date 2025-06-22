export default class RegisterPagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
    }

    initializeForm() {
        const form = document.querySelector('#registerForm');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            this._view.showLoading();
            try {
                const registerData = this._view.getRegisterData();
                if (!registerData.name || !registerData.email || !registerData.password) {
                    throw new Error('Semua field harus diisi.');
                }

                await this._model.register(registerData);
                this._view.showSuccessMessage();
            } catch (error) {
                this._view.showError(error.message);
            }
        });
    }
}