import { LOGIN_USER_FAILED, LOGIN_USER_PENDING, LOGIN_USER_SUCCESS, LOGOUT_USER_PENDING, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILED } from "./actionTypes"


export const loginPending = () => ({ type: LOGIN_USER_PENDING });
export const loginSuccess = (payload) => ({ type: LOGIN_USER_SUCCESS, payload });
export const loginFailed = (payload) => ({ type: LOGIN_USER_FAILED, payload });

export const logoutPending = () => ({ type: LOGOUT_USER_PENDING });
export const logoutSuccess = () => ({ type: LOGOUT_USER_SUCCESS });
export const logoutFailed = (payload) => ({ type: LOGOUT_USER_FAILED, payload });