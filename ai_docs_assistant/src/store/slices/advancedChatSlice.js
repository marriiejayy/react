// src/store/slices/advancedChatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const sendContextualQuery = createAsyncThunk(
  'advancedChat/sendContextualQuery',
  async ({ query, context }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      const response = await fetch('http://localhost:8000/api/chat/contextual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          query, 
          context,
          history: getState().advancedChat.conversationHistory.slice(-10) 
        }),
      });

      if (!response.ok) throw new Error('Query failed');
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const advancedChatSlice = createSlice({
  name: 'advancedChat',
  initialState: {
    messages: [],
    conversationHistory: [],
    context: {
      currentDocument: null,
      relatedDocuments: [],
      extractedEntities: [],
    },
    isProcessing: false,
    suggestions: [],
  },
  reducers: {
    setContext: (state, action) => {
      state.context = { ...state.context, ...action.payload };
    },
    addSuggestion: (state, action) => {
      state.suggestions.push(action.payload);
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    saveConversation: (state) => {
      state.conversationHistory.push({
        timestamp: new Date().toISOString(),
        messages: [...state.messages],
        context: state.context,
      });
    },
    loadConversation: (state, action) => {
      const conversation = state.conversationHistory[action.payload];
      if (conversation) {
        state.messages = conversation.messages;
        state.context = conversation.context;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContextualQuery.pending, (state) => {
        state.isProcessing = true;
      })
      .addCase(sendContextualQuery.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.messages.push(action.payload.response);
        state.suggestions = action.payload.suggestions || [];
      });
  },
});