import axiosInstance from './axiosInstance';

export const servicesApi = data =>
  axiosInstance.post('services', data.data, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
export const bookingListApi = data =>
  axiosInstance.get('bookings/current', {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

export const bookingDetailsApi = data =>
  axiosInstance.get(`bookings/${data.booking_id}/details`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

export const notificationList = data =>
  axiosInstance.get(`user/notifications`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

export const notificationRead = data =>
  axiosInstance.get(`user/${data.notificationId}/read-notification`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
