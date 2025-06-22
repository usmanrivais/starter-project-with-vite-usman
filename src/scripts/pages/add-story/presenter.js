import CameraHelper from '../../utils/camera-helper';
import LocationHelper from '../../utils/location-helper';

export default class AddStoryPresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
    }

    initializeForm() {
        this._setupCamera();
        this._setupLocationPicker();
        this._setupFormSubmit();
    }

    _setupCamera() {
        const startButton = document.querySelector('#start-camera-button');
        const captureButton = document.querySelector('#capture-button');

        startButton.addEventListener('click', async () => {
            await CameraHelper.startCamera();
            startButton.style.display = 'none';
            captureButton.style.display = 'inline-block';
        });

        captureButton.addEventListener('click', async () => {
            try {
                const blob = await CameraHelper.captureImage();
                this._view.setPhoto(blob);
                CameraHelper.stopCameraStream();
                captureButton.style.display = 'none';
            } catch (error) {
                console.error('Failed to capture image:', error);
                alert('Gagal mengambil gambar. Silakan coba lagi.');
            }
        });
    }

    _setupLocationPicker() {
        LocationHelper.init();
    }

    _setupFormSubmit() {
        const form = document.querySelector('#addStoryForm');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            this._view.showLoading();
            try {
                const formData = this._view.getFormData();
                if (!formData.description || !formData.photo) {
                    throw new Error('Deskripsi dan foto tidak boleh kosong.');
                }
                await this._model.addNewStory(formData);
                this._view.showSuccess();
            } catch (error) {
                this._view.showError(error.message);
            }
        });
    }
}