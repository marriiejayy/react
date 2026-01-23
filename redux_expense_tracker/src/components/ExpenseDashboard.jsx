// src/components/ExpenseDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllExpenses, 
  selectTotalBudget, 
  selectTotalSpent, 
  selectRemainingBudget,
  selectCategories,
  selectFilteredExpenses,
  selectCategoryBreakdown,
  selectExpenseStats,
  selectFilters,
  selectCurrentDateTime,
  selectTodayExpenses,
  selectThisMonthExpenses,
  selectRecentExpenses,
  selectTheme,
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
} from '../store/slices/expenseSlice';
import { 
  MdAdd, 
  MdDelete, 
  MdEdit,
  MdSearch,
  MdTrendingUp, 
  MdTrendingDown,
  MdPieChart,
  MdCalendarMonth,
  MdSavings,
  MdDownload,
  MdWarning,
  MdBarChart,
  MdShowChart,
  MdInfo,
  MdClose,
  MdCheck,
  MdUpload,
  MdFoodBank,
  MdLocalGasStation,
  MdShoppingBag,
  MdHome,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdSchool,
  MdLocalMovies,
  MdAttachMoney,
  MdAccessTime,
  MdToday,
  MdCalendarToday,
  MdFilterList,
  MdDarkMode,
  MdLightMode,
  MdSettings,
  MdPalette
} from 'react-icons/md';
import { FaNairaSign, FaChartPie } from 'react-icons/fa6';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Modal from './Modal';

// Icon mapping
const iconComponents = {
  MdFoodBank, MdLocalGasStation, MdShoppingBag, MdHome,
  MdDirectionsCar, MdHealthAndSafety, MdSchool, MdLocalMovies, MdAttachMoney
};

const ExpenseDashboard = () => {
  const dispatch = useDispatch();
  const expenses = useSelector(selectAllExpenses);
  const filteredExpenses = useSelector(selectFilteredExpenses);
  const totalBudget = useSelector(selectTotalBudget);
  const totalSpent = useSelector(selectTotalSpent);
  const remainingBudget = useSelector(selectRemainingBudget);
  const categories = useSelector(selectCategories);
  const categoryBreakdown = useSelector(selectCategoryBreakdown);
  const expenseStats = useSelector(selectExpenseStats);
  const filters = useSelector(selectFilters);
  const currentDateTime = useSelector(selectCurrentDateTime);
  const todayExpenses = useSelector(selectTodayExpenses);
  const thisMonthExpenses = useSelector(selectThisMonthExpenses);
  const recentExpenses = useSelector(selectRecentExpenses);
  const theme = useSelector(selectTheme);
  
  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [currentTime, setCurrentTime] = useState(currentDateTime.currentTime);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: currentDateTime.currentDate,
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState(filters.search);
  
  // Modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Apply theme to body
  useEffect(() => {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [theme]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-NG', { hour12: true }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update form date when current date changes
  useEffect(() => {
    if (!editingExpense && !showAddForm) {
      setFormData(prev => ({
        ...prev,
        date: currentDateTime.currentDate
      }));
    }
  }, [currentDateTime.currentDate, editingExpense, showAddForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    if (editingExpense) {
      dispatch(updateExpense({ id: editingExpense.id, ...formData }));
    } else {
      dispatch(addExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      }));
    }
    
    resetForm();
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      notes: expense.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (expenseToDelete) {
      dispatch(removeExpense(expenseToDelete.id));
      setExpenseToDelete(null);
    }
  };

  const handleClearAllClick = () => {
    setShowClearAllConfirm(true);
  };

  const confirmClearAll = () => {
    dispatch(clearAllExpenses());
  };

  const handleUpdateBudgetClick = () => {
    setShowBudgetModal(true);
  };

  const handleBudgetSubmit = (newBudget) => {
    const budgetValue = parseFloat(newBudget);
    if (!isNaN(budgetValue) && budgetValue >= 0) {
      dispatch(setBudget(budgetValue));
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'food',
      date: currentDateTime.currentDate,
      notes: ''
    });
    setEditingExpense(null);
    setShowAddForm(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryFilter = (category) => {
    dispatch(setFilters({ category }));
  };

  const handleDateFilter = (type, value) => {
    dispatch(setFilters({ [type]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return <MdAttachMoney className="text-lg" />;
    
    const IconComponent = iconComponents[category.icon];
    return IconComponent ? <IconComponent className="text-lg" /> : <MdAttachMoney className="text-lg" />;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#6b7280';
  };

  const spendingPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = remainingBudget < 0;
  const budgetWarning = spendingPercentage > 80;

  // Prepare data for pie chart
  const pieChartData = categoryBreakdown.map(item => ({
    name: item.name,
    value: item.total,
    color: item.color
  }));

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ['Description', 'Amount', 'Category', 'Date', 'Notes', 'Created At'];
    const csvData = filteredExpenses.map(exp => [
      `"${exp.description}"`,
      exp.amount,
      `"${categories.find(c => c.id === exp.category)?.name || exp.category}"`,
      exp.date,
      `"${exp.notes || ''}"`,
      exp.createdAt ? new Date(exp.createdAt).toLocaleString() : ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses-${currentDateTime.currentDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick date filter buttons
  const quickDateFilters = [
    { label: 'Today', action: () => dispatch(setTodayFilter()), icon: <MdToday /> },
    { label: 'This Month', action: () => dispatch(setCurrentMonthFilter()), icon: <MdCalendarToday /> },
    { label: 'Last 30 Days', action: () => dispatch(setLast30DaysFilter()), icon: <MdCalendarMonth /> },
    { label: 'All Time', action: () => dispatch(resetFilters()), icon: <MdFilterList /> }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'
    } p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Modals */}
        <Modal 
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Delete Expense"
          type="danger"
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete "{expenseToDelete?.description}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDelete();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        <Modal 
          isOpen={showClearAllConfirm}
          onClose={() => setShowClearAllConfirm(false)}
          title="Clear All Expenses"
          type="danger"
        >
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete ALL expenses? This action cannot be undone and will remove all your expense data.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmClearAll();
                  setShowClearAllConfirm(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </Modal>

        <Modal 
          isOpen={showBudgetModal}
          onClose={() => setShowBudgetModal(false)}
          title="Update Monthly Budget"
          type="info"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.elements.budget;
            handleBudgetSubmit(input.value);
            setShowBudgetModal(false);
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter new monthly budget amount (₦)
                </label>
                <input
                  name="budget"
                  type="number"
                  defaultValue={totalBudget.toString()}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. 200000"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBudgetModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update Budget
                </button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Settings Modal */}
        <Modal 
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          title="Settings"
          type="info"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Appearance</h4>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {theme === 'dark' ? (
                      <MdDarkMode className="text-xl text-gray-300" />
                    ) : (
                      <MdLightMode className="text-xl text-gray-700" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Theme</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Options</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
                    theme === 'light' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <MdLightMode className={`text-2xl ${theme === 'light' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}>
                    Light
                  </span>
                </button>
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className={`p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
                    theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <MdDarkMode className={`text-2xl ${theme === 'dark' ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    Dark
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>

        {/* Header with Real-Time Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {/* <FaNairaSign className="text-green-600 dark:text-green-400" /> */}
                Naija Expense Tracker
              </h1>
              <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${
                theme === 'dark' 
                  ? 'bg-blue-900/30 text-blue-300' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                <MdAccessTime />
                <span>{currentTime}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                {currentDateTime.currentMonth} • {currentDateTime.currentDate}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className={`px-2 py-1 rounded ${
                  theme === 'dark' 
                    ? 'bg-green-900/30 text-green-300' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  Today: {todayExpenses.length} expenses
                </span>
                <span className={`px-2 py-1 rounded ${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 text-blue-300' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  This Month: {thisMonthExpenses.length} expenses
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <MdLightMode className="text-xl" />
              ) : (
                <MdDarkMode className="text-xl" />
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title="Settings"
            >
              <MdSettings className="text-xl" />
            </button>

            <button
              onClick={() => setShowStats(!showStats)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {showStats ? <MdClose /> : <MdBarChart />}
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
            
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <MdDownload />
              Export CSV
            </button>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <MdAdd />
              {editingExpense ? 'Edit Expense' : 'Add Expense'}
            </button>
          </div>
        </div>

        {/* Quick Date Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MdCalendarMonth className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickDateFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={filter.action}
                className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={`mb-8 rounded-2xl shadow-lg p-4 border ${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MdSearch className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Search expenses by description or notes..."
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex-1">
              <select
                value={filters.category}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            {/* Date Range */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className={`absolute left-3 top-3 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>From</span>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleDateFilter('startDate', e.target.value)}
                  className={`w-full pl-16 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <div className="relative flex-1">
                <span className={`absolute left-3 top-3 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>To</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleDateFilter('endDate', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            {/* Clear Filters */}
            {(filters.search || filters.category !== 'all' || filters.startDate !== currentDateTime.currentMonthRange.startDate || filters.endDate !== currentDateTime.currentMonthRange.endDate) && (
              <button
                onClick={() => {
                  dispatch(resetFilters());
                  setSearchTerm('');
                }}
                className={`px-4 py-3 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MdClose />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Stats Dashboard */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Budget Card */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              budgetWarning 
                ? theme === 'dark'
                  ? 'border-yellow-800 bg-yellow-900/20'
                  : 'border-yellow-200 bg-yellow-50'
                : theme === 'dark'
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                }`}>
                  <MdSavings className={`text-2xl ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                {budgetWarning && (
                  <span className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1 ${
                    theme === 'dark'
                      ? 'text-yellow-400 bg-yellow-900/30'
                      : 'text-yellow-600 bg-yellow-100'
                  }`}>
                    <MdWarning /> Warning
                  </span>
                )}
              </div>
              <h3 className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Monthly Budget</h3>
              <div className={`text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {formatCurrency(totalBudget)}
              </div>
              <button
                onClick={handleUpdateBudgetClick}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update Budget
              </button>
            </div>

            {/* Spent Card */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                }`}>
                  <MdTrendingUp className={`text-2xl ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    theme === 'dark'
                      ? 'text-red-400 bg-red-900/30'
                      : 'text-red-600 bg-red-100'
                  }`}>
                    Total Spent
                  </span>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {filters.startDate} to {filters.endDate}
                  </p>
                </div>
              </div>
              <h3 className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Amount Spent</h3>
              <div className={`text-3xl font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {formatCurrency(totalSpent)}
              </div>
              <div className={`w-full rounded-full h-2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    spendingPercentage > 90 ? 'bg-red-500' :
                    spendingPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {spendingPercentage.toFixed(1)}% of budget used
              </p>
            </div>

            {/* Remaining Card */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              isOverBudget 
                ? theme === 'dark'
                  ? 'border-red-800 bg-red-900/20'
                  : 'border-red-200 bg-red-50'
                : theme === 'dark'
                  ? 'border-green-800 bg-green-900/20'
                  : 'border-green-200 bg-green-50'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  isOverBudget 
                    ? theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'
                    : theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                  <MdTrendingDown className={`text-2xl ${
                    isOverBudget 
                      ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      : theme === 'dark' ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  isOverBudget 
                    ? theme === 'dark'
                      ? 'text-red-400 bg-red-900/30'
                      : 'text-red-600 bg-red-100'
                    : theme === 'dark'
                      ? 'text-green-400 bg-green-900/30'
                      : 'text-green-600 bg-green-100'
                }`}>
                  {isOverBudget ? 'Overspent' : 'Remaining'}
                </span>
              </div>
              <h3 className={`text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Available Balance</h3>
              <div className={`text-3xl font-bold mb-2 ${
                isOverBudget 
                  ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  : theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                {formatCurrency(Math.abs(remainingBudget))}
              </div>
              {isOverBudget ? (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-500'
                }`}>
                  Exceeded by {formatCurrency(Math.abs(remainingBudget))}
                </p>
              ) : (
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  Within budget
                </p>
              )}
              <p className={`text-sm mt-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {filteredExpenses.length} expenses in selected period
              </p>
            </div>

            {/* Real-Time Stats */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                }`}>
                  <MdInfo className={`text-2xl ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  theme === 'dark'
                    ? 'text-purple-400 bg-purple-900/30'
                    : 'text-purple-600 bg-purple-100'
                }`}>
                  Real-Time Stats
                </span>
              </div>
              
              {expenseStats ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Today's Expenses:</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {todayExpenses.length} ({formatCurrency(todayExpenses.reduce((sum, exp) => sum + exp.amount, 0))})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>This Month:</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatCurrency(expenseStats.thisMonthTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Average Expense:</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {formatCurrency(expenseStats.average)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>Total Expenses:</span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {expenseStats.count}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No expense data yet
                  </p>
                  <p className={`text-xs mt-1 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Add your first expense!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Charts Section */}
        {showStats && categoryBreakdown.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                  <FaChartPie className="text-blue-600 dark:text-blue-400" />
                  Spending by Category
                </h3>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {categoryBreakdown.length} active categories
                </span>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Amount']}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        color: theme === 'dark' ? '#f3f4f6' : '#111827'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{
                        color: theme === 'dark' ? '#f3f4f6' : '#111827'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Category Legend */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryBreakdown.map((category) => (
                  <div 
                    key={category.id} 
                    className={`flex items-center justify-between p-2 rounded ${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatCurrency(category.total)}
                      </span>
                      <span className={`text-xs ml-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-2xl shadow-lg p-6 border ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                  <MdShowChart className="text-green-600 dark:text-green-400" />
                  Recent Expenses
                </h3>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Latest {recentExpenses.length} expenses
                </span>
              </div>
              
              {recentExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <FaNairaSign className="text-2xl text-gray-400" />
                  </div>
                  <h4 className={`font-medium ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    No recent expenses
                  </h4>
                  <p className={`text-sm mt-1 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Add your first expense to see activity here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentExpenses.map(expense => (
                    <div 
                      key={expense.id} 
                      className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-700 hover:bg-gray-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: getCategoryColor(expense.category) + (theme === 'dark' ? '30' : '20') }}>
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {expense.description}
                          </h4>
                          <div className={`flex items-center gap-3 text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span className="capitalize">
                              {categories.find(c => c.id === expense.category)?.name || expense.category}
                            </span>
                            <span>•</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                            {expense.createdAt && (
                              <>
                                <span>•</span>
                                <span className="text-xs">
                                  {new Date(expense.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </>
                            )}
                          </div>
                          {expense.notes && (
                            <p className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {expense.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formatCurrency(expense.amount)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(expense)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'text-blue-400 hover:bg-blue-900/30'
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title="Edit expense"
                          >
                            <MdEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(expense)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'text-red-400 hover:bg-red-900/30'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title="Delete expense"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add/Edit Expense Form */}
        {(showAddForm || editingExpense) && (
          <div className={`mb-8 rounded-2xl shadow-lg p-6 border ${
            theme === 'dark'
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <button
                onClick={resetForm}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MdClose className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="What did you spend on?"
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Amount (₦) *
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <FaNairaSign />
                    </span>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Add any notes about this expense..."
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <MdCheck />
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Expenses List */}
        <div className={`rounded-2xl shadow-lg p-6 border ${
          theme === 'dark'
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <MdCalendarMonth className="text-blue-600 dark:text-blue-400" />
                All Expenses
              </h3>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Showing {filteredExpenses.length} of {expenses.length} expenses
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {expenses.length > 0 && (
                <>
                  <button
                    onClick={handleClearAllClick}
                    className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      theme === 'dark'
                        ? 'border-red-800 text-red-400 hover:bg-red-900/30'
                        : 'border-red-300 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <MdDelete />
                    Clear All
                  </button>
                  
                  <button
                    onClick={() => {
                      const sampleExpense = {
                        description: 'Sample expense',
                        amount: 5000,
                        category: 'other',
                        date: currentDateTime.currentDate,
                        notes: 'Sample data for demonstration'
                      };
                      dispatch(addExpense(sampleExpense));
                    }}
                    className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      theme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MdUpload />
                    Add Sample
                  </button>
                </>
              )}
            </div>
          </div>
          
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <FaNairaSign className="text-2xl text-gray-400" />
              </div>
              <h4 className={`font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No expenses found
              </h4>
              <p className={`text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {expenses.length === 0 
                  ? 'Add your first expense to get started' 
                  : 'Try changing your search or filters'}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
              >
                <MdAdd />
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <th className={`text-left py-3 px-4 font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Description</th>
                    <th className={`text-left py-3 px-4 font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Category</th>
                    <th className={`text-left py-3 px-4 font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Date</th>
                    <th className={`text-left py-3 px-4 font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Amount</th>
                    <th className={`text-left py-3 px-4 font-medium ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(expense => (
                    <tr 
                      key={expense.id} 
                      className={`border-b transition-colors ${
                        theme === 'dark'
                          ? 'border-gray-800 hover:bg-gray-700/50'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className={`font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {expense.description}
                          </div>
                          {expense.notes && (
                            <div className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {expense.notes}
                            </div>
                          )}
                          {expense.createdAt && (
                            <div className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              Added: {new Date(expense.createdAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: getCategoryColor(expense.category) + (theme === 'dark' ? '30' : '20') }}>
                            {getCategoryIcon(expense.category)}
                          </div>
                          <span className={`capitalize ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {categories.find(c => c.id === expense.category)?.name || expense.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {new Date(expense.date).toLocaleDateString('en-NG', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formatCurrency(expense.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'text-blue-400 hover:bg-blue-900/30'
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title="Edit"
                          >
                            <MdEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(expense)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === 'dark'
                                ? 'text-red-400 hover:bg-red-900/30'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title="Delete"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDashboard;