// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { logout } from './authSlice';
import { clearChat } from './chatSlice';

// Note: We'll handle clearDocuments differently since we can't import it here

const loadThemePreference = () => {
  const savedTheme = localStorage.getItem('naija-ai-theme');
  return savedTheme || 'light';
};

const saveThemePreference = (theme) => {
  localStorage.setItem('naija-ai-theme', theme);
};

const initialState = {
  sidebarOpen: true,
  theme: loadThemePreference(),
  notifications: [],
  currentView: 'dashboard',
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      saveThemePreference(action.payload);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', action.payload);
      }
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
      // Keep only last 5 notifications
      if (state.notifications.length > 5) {
        state.notifications.shift();
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
      // Clear UI state on logout
      state.notifications = [];
      state.currentView = 'dashboard';
    });
  },
});

export const {
  toggleSidebar,
  setTheme,
  addNotification,
  removeNotification,
  setCurrentView,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;