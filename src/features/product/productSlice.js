import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: 0,
  product: {
    id: 0,
    title: '',
    description: '',
    image: null
  },
  products: []
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    reset: (state) => {
      state.id = 0;
      state.product = {
        id: 0,
        title: '',
        description: '',
        image: null
      };
    }
  },
})

export const { setId, setProducts, setProduct, reset } = productSlice.actions

export default productSlice.reducer