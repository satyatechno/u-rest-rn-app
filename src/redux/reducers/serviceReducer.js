import {createSlice} from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    serviceData: [],
    cart: [],
  },
  reducers: {
    setServiceData(state, action) {
      return {
        ...state,
        serviceData: action.payload,
      };
    },
    setCartData(state, action) {
      return {
        ...state,
        cart: action.payload,
      };
    },
    addCart(state, action) {
      return {
        ...state,
        cart: action.payload,
      };
    },
    removeCart(state, action) {
      if (state?.cart?.cart_items?.length > 1)
        return {
          ...state,
          cart: {
            ...state?.cart,
            cart_items: state.cart?.cart_items?.filter(
              x => x.service_group_id !== action?.payload,
            ),
          },
        };
      else {
        return {
          ...state,
          cart: {},
        };
      }
    },
  },
});

const {actions, reducer} = serviceSlice;
export const {setServiceData, setCartData, addCart, removeCart} = actions;
const serviceReducer = reducer;
export default serviceReducer;
