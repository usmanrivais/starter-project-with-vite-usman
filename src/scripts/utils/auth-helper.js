const AuthHelper = {
    isLoggedIn() {
        // Menggunakan localStorage
        return !!localStorage.getItem('userToken');
    },

    getToken() {
        // Menggunakan localStorage
        return localStorage.getItem('userToken');
    },

    setToken(token) {
        // Menggunakan localStorage
        localStorage.setItem('userToken', token);
    },

    removeToken() {
        // Menggunakan localStorage
        localStorage.removeItem('userToken');
    },
};

export default AuthHelper;