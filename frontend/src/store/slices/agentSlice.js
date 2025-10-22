import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { runAgentPrompt } from '../../services/agent/agentService';

export const sendAgentPrompt = createAsyncThunk('agent/sendPrompt', async (prompt) => {
  const response = await runAgentPrompt(prompt);
  return { prompt, response };
});

const agentSlice = createSlice({
  name: 'agent',
  initialState: { messages: [], loading: false },
  reducers: {
    clearChat: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendAgentPrompt.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendAgentPrompt.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({
          role: 'user',
          content: action.payload.prompt,
        });
        state.messages.push({
          role: 'assistant',
          content: action.payload.response,
        });
      })
      .addCase(sendAgentPrompt.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearChat } = agentSlice.actions;
export default agentSlice.reducer;
