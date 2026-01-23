// src/store/slices/expenseSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

// Helper to get current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Helper to get current month start and end dates
const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};

const initialState = {
  expenses: [],
  totalBudget: 200000,
  categories: [
    { id: 'food', name: 'Food & Dining', icon: 'MdFoodBank', color: '#ef4444' },
    { id: 'transport', name: 'Transportation', icon: 'MdLocalGasStation', color: '#3b82f6' },
    { id: 'shopping', name: 'Shopping', icon: 'MdShoppingBag', color: '#8b5cf6' },
    { id: 'housing', name: 'Housing', icon: 'MdHome', color: '#10b981' },
    { id: 'vehicle', name: 'Vehicle', icon: 'MdDirectionsCar', color: '#f59e0b' },
    { id: 'health', name: 'Health', icon: 'MdHealthAndSafety', color: '#ec4899' },
    { id: 'education', name: 'Education', icon: 'MdSchool', color: '#6366f1' },
    { id: 'entertainment', name: 'Entertainment', icon: 'MdLocalMovies', color: '#06b6d4' },
    { id: 'other', name: 'Other', icon: 'MdAttachMoney', color: '#6b7280' }
  ],
  filters: {
    search: '',
    category: 'all',
    startDate: getCurrentMonthRange().startDate,
    endDate: getCurrentMonthRange().endDate
  },
  theme: 'light'
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      const expense = {
        ...action.payload,
        id: Date.now().toString(),
        date: action.payload.date || getCurrentDate(),
        notes: action.payload.notes || '',
        createdAt: new Date().toISOString()
      };
      state.expenses.unshift(expense);
    },
    
    updateExpense: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.expenses.findIndex(expense => expense.id === id);
      if (index !== -1) {
        state.expenses[index] = { 
          ...state.expenses[index], 
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },
    
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
    },
    
    setBudget: (state, action) => {
      state.totalBudget = action.payload;
    },
    
    clearAllExpenses: (state) => {
      state.expenses = [];
    },
    
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        startDate: getCurrentMonthRange().startDate,
        endDate: getCurrentMonthRange().endDate
      };
    },
    
    setCurrentMonthFilter: (state) => {
      const { startDate, endDate } = getCurrentMonthRange();
      state.filters.startDate = startDate;
      state.filters.endDate = endDate;
    },
    
    setTodayFilter: (state) => {
      const today = getCurrentDate();
      state.filters.startDate = today;
      state.filters.endDate = today;
    },
    
    setLast30DaysFilter: (state) => {
      const endDate = getCurrentDate();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      state.filters.startDate = startDate.toISOString().split('T')[0];
      state.filters.endDate = endDate;
    },
    
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    
    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

export const { 
  addExpense, 
  updateExpense, 
  removeExpense, 
  setBudget, 
  clearAllExpenses,
  setFilters,
  resetFilters,
  setCurrentMonthFilter,
  setTodayFilter,
  setLast30DaysFilter,
  toggleTheme,
  setTheme
} = expenseSlice.actions;

// Basic selectors
export const selectAllExpenses = (state) => state.expenses.expenses;
export const selectTotalBudget = (state) => state.expenses.totalBudget;
export const selectCategories = (state) => state.expenses.categories;
export const selectFilters = (state) => state.expenses.filters;
export const selectTheme = (state) => state.expenses.theme;

// Selector for real-time date info
export const selectCurrentDateTime = createSelector(
  [],
  () => ({
    currentDate: getCurrentDate(),
    currentTime: new Date().toLocaleTimeString('en-NG', { hour12: true }),
    currentMonth: new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }),
    currentMonthRange: getCurrentMonthRange()
  })
);

// Memoized selectors
export const selectFilteredExpenses = createSelector(
  [selectAllExpenses, selectFilters],
  (expenses, filters) => {
    return expenses.filter(expense => {
      // Search filter
      const matchesSearch = !filters.search || 
        expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.notes?.toLowerCase().includes(filters.search.toLowerCase());
      
      // Category filter
      const matchesCategory = filters.category === 'all' || expense.category === filters.category;
      
      // Date range filter
      const expenseDate = new Date(expense.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      
      let matchesDate = true;
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && expenseDate >= start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && expenseDate <= end;
      }
      
      return matchesSearch && matchesCategory && matchesDate;
    });
  }
);

export const selectTotalSpent = createSelector(
  [selectFilteredExpenses],
  (expenses) => expenses.reduce((total, expense) => total + expense.amount, 0)
);

export const selectRemainingBudget = createSelector(
  [selectTotalBudget, selectTotalSpent],
  (budget, spent) => budget - spent
);

// Category Breakdown Selector - ADD THIS
export const selectCategoryBreakdown = createSelector(
  [selectFilteredExpenses, selectCategories],
  (expenses, categories) => {
    const breakdown = categories.map(category => {
      const categoryExpenses = expenses.filter(exp => exp.category === category.id);
      const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const allExpensesTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const percentage = allExpensesTotal > 0 ? (total / allExpensesTotal) * 100 : 0;
      
      return {
        ...category,
        total,
        count: categoryExpenses.length,
        percentage: Math.round(percentage * 10) / 10
      };
    }).filter(cat => cat.total > 0);
    
    return breakdown.sort((a, b) => b.total - a.total);
  }
);

export const selectRecentExpenses = createSelector(
  [selectAllExpenses],
  (expenses) => {
    return [...expenses]
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
      .slice(0, 10);
  }
);

export const selectTodayExpenses = createSelector(
  [selectAllExpenses],
  (expenses) => {
    const today = getCurrentDate();
    return expenses.filter(expense => expense.date === today);
  }
);

export const selectThisMonthExpenses = createSelector(
  [selectAllExpenses],
  (expenses) => {
    const { startDate, endDate } = getCurrentMonthRange();
    return expenses.filter(expense => {
      return expense.date >= startDate && expense.date <= endDate;
    });
  }
);

export const selectExpenseStats = createSelector(
  [selectAllExpenses],
  (expenses) => {
    if (expenses.length === 0) return null;
    
    const amounts = expenses.map(exp => exp.amount);
    const total = amounts.reduce((a, b) => a + b, 0);
    const average = total / expenses.length;
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);
    
    // Find most expensive expense
    const mostExpensive = expenses.reduce((maxExp, exp) => 
      exp.amount > maxExp.amount ? exp : maxExp, expenses[0]);
    
    // Find category with most spending
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)[0];
    
    return {
      total,
      average: Math.round(average),
      max,
      min,
      count: expenses.length,
      mostExpensive,
      topCategory: topCategory ? { category: topCategory[0], amount: topCategory[1] } : null,
      todayCount: selectTodayExpenses({ expenses: { expenses } }).length,
      thisMonthTotal: selectThisMonthExpenses({ expenses: { expenses } })
        .reduce((sum, exp) => sum + exp.amount, 0)
    };
  }
);

export default expenseSlice.reducer;