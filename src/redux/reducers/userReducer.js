import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    skipLogin: false,
    token: undefined,
    user: {},
    addressData: [],
    manageSkipAddress: false,
    primaryAddress: undefined,
    notificationCount: 0,
  },
  reducers: {
    userLogin(state, action) {
      return {
        ...state,
        user: action.payload?.data?.user,
        token: action.payload?.auth_token,
      };
    },
    setAddressData(state, action) {
      return {
        ...state,
        addressData: [...action?.payload],
        primaryAddress: action.payload?.find(item => item?.is_primary === true),
      };
    },
    setNewAddress(state, action) {
      let TempAddress = [...state.addressData];
      if (TempAddress?.findIndex(x => x.id === action?.payload?.id) > -1) {
        TempAddress = TempAddress?.map(y => {
          if (y.id === action.payload.id) {
            return action.payload;
          } else {
            return y;
          }
        });
      } else TempAddress = [...state.addressData, action.payload];
      return {
        ...state,
        addressData: [...TempAddress],
        primaryAddress: action?.payload?.is_primary
          ? action?.payload
          : state.primaryAddress,
      };
    },
    setSkipLogin(state, action) {
      return {
        ...state,
        skipLogin: action?.payload,
      };
    },
    setManageAddressNavigation(state, action) {
      return {
        ...state,
        manageSkipAddress: action.payload,
      };
    },
    setAddressAsPrimary(state, action) {
      return {
        ...state,
        primaryAddress: state.addressData?.find(
          item => item?.id === action.payload,
        ),
      };
    },
    setNotificationCount(state, action) {
      return {
        ...state,
        notificationCount: action.payload,
      };
    },
  },
});

const {actions, reducer} = userSlice;
export const {
  userLogin,
  setNewAddress,
  setAddressData,
  setSkipLogin,
  setManageAddressNavigation,
  setAddressAsPrimary,
  setNotificationCount,
} = actions;
const userReducer = reducer;
export default userReducer;
