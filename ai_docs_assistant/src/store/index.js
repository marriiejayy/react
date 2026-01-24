// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import documentReducer from './slices/documentSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';

// Middleware to handle cross-slice actions
const crossSliceMiddleware = (store) => (next) => (action) => {
  if (action.type === 'auth/logout') {
    // Clear documents and chat on logout
    store.dispatch({ type: 'document/clearDocuments' });
    store.dispatch({ type: 'chat/clearChat' });
  }
  
  return next(action);
};

const rootReducer = combineReducers({
  auth: authReducer,
  document: documentReducer,
  chat: chatReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(crossSliceMiddleware),
});

export default store;