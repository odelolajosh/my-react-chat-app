import { LOGIN_USER_FAILED, LOGIN_USER_PENDING, LOGIN_USER_SUCCESS, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILED, LOGOUT_USER_PENDING } from "./actionTypes";


const defaultState = {
    token: null,
    error: null,
    userId: null,
    isLoading: false
};
export const userReducer = (state=defaultState, { type, payload }) => {
    switch(type) {
        case LOGIN_USER_PENDING:
            return { ...state, isLoading: true, error: null }
        case LOGIN_USER_SUCCESS:
            return { ...state, token: payload.token, isLoading: false, userId: payload.userId, error: null }
        case LOGIN_USER_FAILED:
            return { ...state, token: null, isLoading: false, userId: null, error: payload.error }
        case LOGOUT_USER_PENDING:
            return { ...state, isLoading: true, error: null }
        case LOGOUT_USER_SUCCESS:
            return { ...state, token: null, isLoading: false, userId: null, error: null }
        case LOGOUT_USER_FAILED:
            return { ...state, token: null, isLoading: false, userId: null, error: payload.error }
        default:
            return state;
    }
}