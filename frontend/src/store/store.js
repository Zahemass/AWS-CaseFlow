import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import casesReducer from './slices/casesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
  },
})

export default store
