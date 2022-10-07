import axiosInstance from './axiosInstance';

export const payUser = (fd, token) =>
  axiosInstance.post('pay', fd, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
