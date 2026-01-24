// src/store/slices/realtimeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { wsService } from '../../services/websocket';

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState: {
    onlineUsers: [],
    typingUsers: {},
    documentUpdates: [],
    isConnected: false,
  },
  reducers: {
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addTypingUser: (state, action) => {
      const { userId, documentId } = action.payload;
      state.typingUsers[documentId] = state.typingUsers[documentId] || [];
      if (!state.typingUsers[documentId].includes(userId)) {
        state.typingUsers[documentId].push(userId);
      }
    },
    removeTypingUser: (state, action) => {
      const { userId, documentId } = action.payload;
      if (state.typingUsers[documentId]) {
        state.typingUsers[documentId] = state.typingUsers[documentId].filter(id => id !== userId);
      }
    },
  },
});

// WebSocket middleware
export const realtimeMiddleware = (store) => (next) => (action) => {
  if (action.type === 'auth/loginUser/fulfilled') {
    // Connect to WebSocket after login
    wsService.connect(action.payload.token);
    
    // Subscribe to real-time events
    wsService.subscribe('user_online', (users) => {
      store.dispatch(updateOnlineUsers(users));
    });
    
    wsService.subscribe('user_typing', (data) => {
      store.dispatch(addTypingUser(data));
    });
    
    wsService.subscribe('document_updated', (document) => {
      // Update document in store
      store.dispatch(updateDocument(document));
    });
  }
  
  if (action.type === 'auth/logout') {
    wsService.socket?.close();
  }
  
  return next(action);
};

export const { setConnectionStatus, updateOnlineUsers, addTypingUser, removeTypingUser } = realtimeSlice.actions;
export default realtimeSlice.reducer;