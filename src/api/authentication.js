import axiosInstance from './axiosInstance';

export const registerApi = data => axiosInstance.post('register', data);
export const fetchCountry = () => axiosInstance.get('countries');
export const loginApi = data => axiosInstance.post('login', data);
export const otpVerifyApi = data =>
  axiosInstance.post('verify-otp', data.data, {
    params: {
      type: data.type,
    },
  });
export const resendOtpApi = data =>
  axiosInstance.post('resend-code', data.data, {
    params: {
      type: data.type,
    },
  });
export const logoutApi = data =>
  axiosInstance.post(
    'logout',
    {},
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

export const saveDevice = data =>
  axiosInstance.post('device', data.data, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
export const deleteAccountApi = data =>
  axiosInstance.get(
    'profile/delete',

    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );
export const getAppDataApi = data => axiosInstance.get('/');
