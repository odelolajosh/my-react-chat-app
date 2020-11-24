import { userReducer } from './user/reducer';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

const reducer = combineReducers({
    auth: userReducer
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;