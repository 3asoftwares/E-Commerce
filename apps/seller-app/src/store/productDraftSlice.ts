import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductDraft {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

interface ProductDraftState {
  draft: ProductDraft | null;
}

const initialState: ProductDraftState = {
  draft: null,
};

const productDraftSlice = createSlice({
  name: 'productDraft',
  initialState,
  reducers: {
    setDraft: (state, action: PayloadAction<ProductDraft>) => {
      state.draft = action.payload;
    },
    clearDraft: (state) => {
      state.draft = null;
    },
  },
});

export const { setDraft, clearDraft } = productDraftSlice.actions;
export default productDraftSlice.reducer;
