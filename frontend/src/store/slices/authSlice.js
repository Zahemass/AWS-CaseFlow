import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout, getCurrentUser } from '../../services/auth/authService';

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async () => {
  const data = await getCurrentUser();
  return data?.user || null;
});

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }) => {
  const user = await login(email, password);
  return user;
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
