import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, createStore} from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import bookingReducer from './reducers/bookingReducer';
import serviceReducer from './reducers/serviceReducer';
import staticReducer from './reducers/staticReducer';
import userReducer from './reducers/userReducer';

const appReducer = combineReducers({
  userReducer,
  staticReducer,
  serviceReducer,
  bookingReducer,
});

const rootReducer = (state, action) => {
  let reduxState = state;
  if (action.type === 'LOGOUT') {
    if (state) {
      for (let [key, value] of Object.entries(reduxState)) {
        if (key === 'staticReducer') {
          reduxState[key] = value;
        } else {
          reduxState[key] = undefined;
        }
      }
      state = reduxState;
    }
  }
  return appReducer(state, action);
};
const persistConfig = {
  key: 'PAIRROXZ_CLEANING_APP',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
