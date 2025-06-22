const AuthHelper = {
    isLoggedIn() {
        return !!sessionStorage.getItem('userToken');
    },

    getToken() {
        return sessionStorage.getItem('userToken');
    },

    setToken(token) {
        sessionStorage.setItem('userToken', token);
    },

    removeToken() {
        sessionStorage.removeItem('userToken');
    },
};

export default AuthHelper;