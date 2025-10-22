import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { listAllDocuments, deleteDocumentById } from '../../services/documents/documentService';

export const fetchDocuments = createAsyncThunk('documents/fetchDocuments', async () => {
  return await listAllDocuments();
});

export const deleteDocument = createAsyncThunk('documents/deleteDocument', async (id) => {
  await deleteDocumentById(id);
  return id;
});

const documentsSlice = createSlice({
  name: 'documents',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    addDocument: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export const { addDocument } = documentsSlice.actions;
export default documentsSlice.reducer;
