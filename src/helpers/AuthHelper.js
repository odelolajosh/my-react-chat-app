
class AuthHelper {
    USER_TOKEN_KEY = "user_token_key";
    USER_ID_KEY = "user_id_key";
    
    getAuthValue = () => ({
        token: window.localStorage.getItem(this.USER_TOKEN_KEY),
        userId: window.localStorage.getItem(this.USER_ID_KEY)
    });
    isAuthenticated = () => Boolean(window.localStorage.getItem(this.USER_TOKEN_KEY));
    authenticate = (userId, token, callback) => {
        window.localStorage.setItem(this.USER_TOKEN_KEY, token)
        window.localStorage.setItem(this.USER_ID_KEY, userId)
        if (callback && typeof callback === "function")
            return callback()
    };
    unauthenticate = (callback) => {
        window.localStorage.clear();
        if (callback && typeof callback === "function")
            callback()
    };
}

export default new AuthHelper();