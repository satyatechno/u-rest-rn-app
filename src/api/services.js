import axios from 'axios';
import axiosInstance from './axiosInstance';
const CancelToken = axios.CancelToken;
export let searchApiToken = null;
export const getServicesApi = () => axiosInstance.get('services');
export const searchServicesApi = data => {
  return axiosInstance.get('services/search', {
    params: {
      search_key: data?.search,
    },
    cancelToken: new CancelToken(function executor(c) {
      // An executor function receives a cancel function as a parameter
      searchApiToken = c;
    }),
  });
};
export const getServicesDetailApi = data =>
  axiosInstance.get(`services/${data?.service_id}/details`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
export const bookServiceApi = data =>
  axiosInstance.post(`bookings/book`, data.data, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
export const addToCartApi = data =>
  axiosInstance.post(`add-to-cart`, data.data, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

export const fetchCartList = data =>
  axiosInstance.get(`cart/list`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
export const deleteFromCart = data =>
  axiosInstance.delete(`cart/${data?.group_id}/remove`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
