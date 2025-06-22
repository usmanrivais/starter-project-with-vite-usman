export default class LoginPagePresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
    }

    initializeForm() {
        const form = document.querySelector('#loginForm');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            this._view.showLoading();
            try {
                const loginData = this._view.getLoginData();
                if (!loginData.email || !loginData.password) {
                    throw new Error('Email dan password tidak boleh kosong.');
                }

                const result = await this._model.login(loginData);
                this._view.loginSuccess(result.token);
            } catch (error) {
                this._view.showError(error.message);
            }
        });
    }
}