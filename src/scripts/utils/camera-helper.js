const CameraHelper = {
    _stream: null,

    async startCamera() {
        try {
            this._stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.querySelector('#video-preview');
            video.srcObject = this._stream;
            video.style.display = 'block';
            document.querySelector('#image-preview').style.display = 'none';
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert('Tidak dapat mengakses kamera.');
        }
    },

    captureImage() {
        const video = document.querySelector('#video-preview');
        const canvas = document.querySelector('#canvas-preview');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imagePreview = document.querySelector('#image-preview');
        imagePreview.src = canvas.toDataURL('image/jpeg');
        imagePreview.style.display = 'block';
        video.style.display = 'none';

        return new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg');
        });
    },

    stopCameraStream() {
        if (this._stream) {
            this._stream.getTracks().forEach(track => track.stop());
            this._stream = null;
        }
    }
};

export default CameraHelper;