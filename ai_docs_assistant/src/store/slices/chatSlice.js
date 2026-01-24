// src/store/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for sending chat query
export const sendQuery = createAsyncThunk(
  'chat/sendQuery',
  async ({ query, documentId }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response based on query
      const responses = {
        'hello': 'Hello! How can I assist you with your documents today?',
        'summary': 'Based on the documents, I found key insights about revenue growth and market trends.',
        'help': 'I can help you analyze documents, answer questions, and extract key information.',
        'default': 'I understand your query. Let me analyze the relevant documents to provide you with the most accurate information.'
      };
      
      return { 
        query, 
        response: responses[query.toLowerCase()] || responses.default 
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  messages: [
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your Naija AI Assistant. I can help you analyze documents and answer questions.',
      timestamp: new Date().toISOString(),
    }
  ],
  isAgentTyping: false,
  error: null,
  currentDocumentId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [{
        id: 1,
        role: 'assistant',
        content: 'Chat cleared. How can I help you today?',
        timestamp: new Date().toISOString(),
      }];
      state.currentDocumentId = null;
    },
    setCurrentDocument: (state, action) => {
      state.currentDocumentId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendQuery.pending, (state) => {
        state.isAgentTyping = true;
        state.error = null;
      })
      .addCase(sendQuery.fulfilled, (state, action) => {
        state.isAgentTyping = false;
        // Add user message if not already added
        const userMessageExists = state.messages.some(
          msg => msg.content === action.payload.query && msg.role === 'user'
        );
        if (!userMessageExists) {
          state.messages.push({
            id: Date.now(),
            role: 'user',
            content: action.payload.query,
            timestamp: new Date().toISOString(),
          });
        }
        // Add AI response
        state.messages.push({
          id: Date.now() + 1,
          role: 'assistant',
          content: action.payload.response,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(sendQuery.rejected, (state, action) => {
        state.isAgentTyping = false;
        state.error = action.payload;
        state.messages.push({
          id: Date.now(),
          role: 'system',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const { addMessage, clearChat, setCurrentDocument } = chatSlice.actions;
export default chatSlice.reducer;