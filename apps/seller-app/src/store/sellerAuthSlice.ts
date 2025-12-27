import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Seller {
  id: string;
  email: string;
  name: string;
  shopName: string;
}

interface SellerAuthState {
  seller: Seller | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: SellerAuthState = {
  seller: null,
  token: null,
  isAuthenticated: false,
};

const sellerAuthSlice = createSlice({
  name: 'sellerAuth',
  initialState,
  reducers: {
    setSeller: (state, action: PayloadAction<{ seller: Seller; token: string }>) => {
      state.seller = action.payload.seller;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.seller = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setSeller, logout } = sellerAuthSlice.actions;
export default sellerAuthSlice.reducer;
