// store/rootReducer.js
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import documentReducer from './slices/documentSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';

// Custom middleware to handle cross-slice actions
const crossSliceMiddleware = (store) => (next) => (action) => {
  if (action.type === 'auth/logout') {
    // Clear documents and chat on logout
    store.dispatch({ type: 'document/clearDocuments' });
    store.dispatch({ type: 'chat/clearChat' });
  }
  
  if (action.type === 'document/uploadDocument/fulfilled') {
    // Add notification via UI slice
    const { document } = action.payload;
    store.dispatch(uiSlice.actions.addNotification({
      id: Date.now(),
      type: 'success',
      message: `Document "${document.name}" uploaded successfully`,
    }));
  }
  
  return next(action);
};

const rootReducer = combineReducers({
  auth: authReducer,
  document: documentReducer,
  chat: chatReducer,
  ui: uiReducer,
});

export { rootReducer, crossSliceMiddleware };