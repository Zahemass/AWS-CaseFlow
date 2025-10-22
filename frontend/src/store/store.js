import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import casesReducer from './slices/casesSlice';
import documentsReducer from './slices/documentsSlice';
import agentReducer from './slices/agentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
    documents: documentsReducer,
    agent: agentReducer,
  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
