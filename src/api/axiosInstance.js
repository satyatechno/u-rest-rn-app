import axios from 'axios';
import {store} from 'src/redux/store';
import {navigationRef} from 'src/utils/Navigation';
import {errorToast} from 'src/utils/toast';
// import Snackbar from 'react-native-snackbar';
// import {store} from 'src/redux/store';
// import colors from 'src/styles/colors/colors';
// import {navigationRef} from 'src/utils/Navigation';

// const BASE_URL = 'http://192.168.1.91:8000/api/';
const BASE_URL = 'https://u-restbahamas.com/api/'; //live
// const BASE_URL = 'http://bedrock.pzdev.tk/api/'; // dev

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'en',
  },
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      errorToast(error?.response?.data?.message);
      navigationRef?.current?.reset({index: 0, routes: [{name: 'Welcome'}]});
      store.dispatch({type: 'LOGOUT'});
      throw error;
    } else throw error;
  },
);

export default axiosInstance;
