// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
  },
});

export default store;