import CONFIG from '../config';
import AuthHelper from '../utils/auth-helper';

class StoryApiSource {
    static async login({ email, password }) {
        const response = await fetch(`${CONFIG.BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const responseJson = await response.json();
        if (responseJson.error) {
            throw new Error(responseJson.message);
        }
        return responseJson.loginResult;
    }

    static async register({ name, email, password }) {
        const response = await fetch(`${CONFIG.BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const responseJson = await response.json();
        if (responseJson.error) {
            throw new Error(responseJson.message);
        }
        return responseJson;
    }

    static async getAllStories() {
        const response = await fetch(`${CONFIG.BASE_URL}/stories?location=1`, {
            headers: { Authorization: `Bearer ${AuthHelper.getToken()}` },
        });
        const responseJson = await response.json();
        if (responseJson.error) {
            throw new Error(responseJson.message);
        }
        return responseJson.listStory;
    }

    static async addNewStory({ description, photo, lat, lon }) {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photo);
        if (lat) formData.append('lat', lat);
        if (lon) formData.append('lon', lon);

        const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${AuthHelper.getToken()}` },
            body: formData,
        });

        const responseJson = await response.json();
        if (responseJson.error) {
            throw new Error(responseJson.message);
        }
        return responseJson;
    }
}

export default StoryApiSource;