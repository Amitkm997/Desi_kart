import { createSlice } from '@reduxjs/toolkit';

const sellerFromStorage = localStorage.getItem('sellerInfo')
  ? JSON.parse(localStorage.getItem('sellerInfo'))
  : null;

const initialState = {
  sellerInfo: sellerFromStorage
};

const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState,
  reducers: {
    setSellerCredentials: (state, action) => {
      state.sellerInfo = action.payload;
      localStorage.setItem('sellerInfo', JSON.stringify(action.payload));
    },
    logoutSeller: (state, action) => {
      state.sellerInfo = null;
      localStorage.removeItem('sellerInfo');
    }
  }
});

export const { setSellerCredentials, logoutSeller } = sellerAuthSlice.actions;

export default sellerAuthSlice.reducer; 