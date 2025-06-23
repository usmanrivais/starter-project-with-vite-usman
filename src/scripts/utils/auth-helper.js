const AuthHelper = {
    isLoggedIn() {
        return !!localStorage.getItem('userToken');
    },

    getToken() {
        return localStorage.getItem('userToken');
    },

    setToken(token) {
        localStorage.setItem('userToken', token);
    },

    removeToken() {
        localStorage.removeItem('userToken');
    },
};

export default AuthHelper;