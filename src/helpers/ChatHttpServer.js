import { loginPending, loginFailed, loginSuccess, logoutSuccess, logoutPending, logoutFailed } from "../services/user/actions";
import AuthHelper from "./AuthHelper";
import ErrorHandler from "./ErrorHandler";

class ChatHttpServer {
    // BASE_URL = "http://localhost:4001/mychatapp/v1/api";
    BASE_URL = "https://my-chat-app-server-0707.herokuapp.com/mychatapp/v1/api";
    REQUEST_OPTIONS = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    getUserRequest = (userId, token) => fetch(`${this.BASE_URL}/user/${userId}`, { ...this.REQUEST_OPTIONS, method: 'GET', headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` }})
    loginRequest = (data) => fetch(`${this.BASE_URL}/user/login`, { ...this.REQUEST_OPTIONS, method: 'POST', body: JSON.stringify(data)})
    signupRequest = (data) => fetch(`${this.BASE_URL}/user/signup`, { ...this.REQUEST_OPTIONS, method: 'POST', body: JSON.stringify(data)})
    checkTokenRequest = (userId, token) => fetch(`${this.BASE_URL}/user/refresh/${userId}`, { ...this.REQUEST_OPTIONS, headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` } }, );
    getMessageRequest = (userId, toUserId, { page, limit }, token) => fetch(`${this.BASE_URL}/message?page=${page}&limit=${limit}`, { ...this.REQUEST_OPTIONS, method: 'POST', body: JSON.stringify({ userId, toUserId }), headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` } }, );
    
    loginUser = (data) => (
        async (dispatch) => {
            try {
                dispatch(loginPending());
                const response = await this.loginRequest(data);
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.token) {
                        return dispatch(loginSuccess(userData));
                    }
                } else {
                    throw ErrorHandler.getResponseError(response);
                }
            } catch(err) {
                const error = await err;
                return dispatch(loginFailed({ error: ErrorHandler.getErrorRemark(error) }))
            }
        }
    )
    
    signupUser = (data) => (
        async (dispatch) => {
            try {
                dispatch(loginPending());
                const response = await this.signupRequest(data);
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.token) {
                        return dispatch(loginSuccess(userData));
                    }
                } else {
                    throw ErrorHandler.getResponseError(response);
                }
            } catch(err) {
                const error = await err;
                return dispatch(loginFailed({ error: ErrorHandler.getErrorRemark(error) }))
            }
        }
    )

    logoutUser = () => (
        async (dispatch) => {
            try {
                dispatch(logoutPending());
                await AuthHelper.unauthenticate();
                return dispatch(logoutSuccess())
            } catch(err) {
                return await dispatch(logoutFailed({ error: err.message }));
            }
        }
    )

    checkToken = (userId, token) => (
        async (dispatch) => {
            try {
                dispatch(loginPending());
                const response = await this.checkTokenRequest(userId, token);
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.token) {
                        return dispatch(loginSuccess(userData));
                    }
                } else {
                    throw ErrorHandler.getResponseError(response);
                }
            } catch(err) {
                let error = await err;
                console.log(error)
                console.log(error.message)
                if (error.message === ErrorHandler.UNAUTHENTICATED_USER)
                    return dispatch(this.logoutUser());
                return dispatch(loginFailed({ error: ErrorHandler.POOR_INTERNET_CONNECTION }))
            }
        }
    )

    getUserDetails = (userId, token) => (
        new Promise(async (resolve, reject) => {
            try {
                const response = await this.getUserRequest(userId, token);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "success") {
                        resolve(data.user)
                    } else {
                        throw new Error("Could not get details")
                    }
                } else {
                    throw new Error("Could not get details")
                }
            } catch (error) {
                reject(error)
            }
        })
    )

    getMessages = (userId, toUserId, { page, limit }, token) => (
        new Promise(async (resolve, reject) => {
            try {
                const response = await this.getMessageRequest(userId, toUserId, { page, limit }, token);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === "success") {
                        resolve(data)
                    } else {
                        throw new Error("Could not load chats")
                    }
                } else {
                    throw new Error("Could not load chats")
                }
            } catch (error) {
                reject({ error })
            }
        })
    )
}

export default new ChatHttpServer();
