import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    name: '',
    email: ''
  },
  token: '',
  authenticated: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAuthenticated: (state, action) => {
      state.authenticated = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = {
        name: '',
        email: ''
      };
      state.token = '';
      state.authenticated = false;
    }
  },
})

export const { setId, setToken, setAuthenticated, setUser, resetUser } = userSlice.actions

export default userSlice.reducer