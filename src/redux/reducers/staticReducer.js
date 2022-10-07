import {createSlice} from '@reduxjs/toolkit';

const staticSlice = createSlice({
  name: 'static',
  initialState: {
    introScreen: true,
  },
  reducers: {
    setIntroStatus(state, action) {
      return {
        ...state,
        introScreen: action.payload,
      };
    },
  },
});

const {actions, reducer} = staticSlice;
export const {setIntroStatus} = actions;
const staticReducer = reducer;
export default staticReducer;
