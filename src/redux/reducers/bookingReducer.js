import {createSlice} from '@reduxjs/toolkit';

const BookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookingData: [],
  },
  reducers: {
    setBookingData(state, action) {
      return {
        ...state,
        bookingData: action.payload,
      };
    },
  },
});

const {actions, reducer} = BookingSlice;
export const {setBookingData} = actions;
const bookingReducer = reducer;
export default bookingReducer;
