import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listCases, createNewCase, removeCase } from '../../services/cases/caseService';

export const fetchCases = createAsyncThunk('cases/fetchCases', async () => {
  return await listCases();
});

export const createCase = createAsyncThunk('cases/createCase', async (data) => {
  return await createNewCase(data);
});

export const deleteCase = createAsyncThunk('cases/deleteCase', async (id) => {
  await removeCase(id);
  return id;
});

const casesSlice = createSlice({
  name: 'cases',
  initialState: { items: [], loading: false, error: null, selected: null },
  reducers: {
    selectCase: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(createCase.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteCase.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { selectCase } = casesSlice.actions;
export default casesSlice.reducer;
