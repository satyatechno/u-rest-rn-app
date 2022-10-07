import axiosInstance from './axiosInstance';

export const addAddressApi = data =>
  axiosInstance.post('user/address/create', data.data, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
export const getAddressApi = data =>
  axiosInstance.get('user/addresses', {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
export const setPrimaryAddress = data =>
  axiosInstance.post(
    `user/address/${data?.address_id}/set-primary`,
    {},
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );
export const getHelpSupportApi = () => axiosInstance.get('admin');
