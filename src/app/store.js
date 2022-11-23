import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/product/productSlice'
import userSlice from '../features/auth/userSlice'

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userSlice,
  },
})