// src/components/ExpenseTracker.jsx
import React, { useState, useEffect, useRef } from 'react';
import useExpenseStore from '../store/expenseStore';
import { 
  FaWallet, FaTrash, FaPlus, FaChartLine, FaTag, FaCalendar, 
  FaMoneyBillWave, FaBell, FaDownload, FaCog,
  FaRedo, FaFileInvoice, FaCloudUploadAlt, FaExchangeAlt,
  FaExclamationTriangle, FaCheckCircle, FaInfoCircle,
  FaChartBar, FaClock, FaPiggyBank, FaLightbulb
} from 'react-icons/fa';

const ExpenseTracker = () => {
  const {
    expenses,
    totalBudget,
    addExpense,
    removeExpense,
    setBudget,
    clearAllExpenses,
    getTotalSpent,
    getRemainingBudget,
    getExpensesByCategory,
    getMonthlyTrend,
    getCategoryInsights,
    expenseGoals,
    addGoal,
    removeGoal,
    recurringExpenses,
    addRecurringExpense,
    removeRecurringExpense,
    toggleRecurringExpense,
    processRecurringExpenses,
    exportToCSV,
    generateReport,
    getForecast,
    getSavingsRecommendation,
    alerts,
    markAlertAsRead,
    markAllAlertsAsRead,
    clearAllAlerts,
    checkAlerts,
    currencies,
    selectedCurrency,
    setCurrency,
    formatCurrency,
    categorizeExpense,
    scanReceipt
  } = useExpenseStore();
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
  });
  
  const [budgetInput, setBudgetInput] = useState(totalBudget);
  const [newGoal, setNewGoal] = useState({ category: 'Food', target: '' });
  const [newRecurring, setNewRecurring] = useState({
    description: '',
    amount: '',
    category: 'Utilities',
    frequency: 'monthly',
    active: true
  });
  const [showAlerts, setShowAlerts] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const fileInputRef = useRef(null);
  
  const categories = [
    'Food', 'Transport', 'Rent', 'Utilities', 
    'Entertainment', 'Healthcare', 'Education', 
    'Savings', 'Shopping', 'Others'
  ];
  
  const frequencies = ['weekly', 'monthly', 'yearly'];
  
  // Initialize and check alerts
  useEffect(() => {
    processRecurringExpenses();
    checkAlerts();
  }, []);
  
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    
    // If category is auto, try to categorize
    if (newExpense.category === 'Auto') {
      const suggestedCategory = await categorizeExpense(newExpense.description);
      addExpense({
        ...newExpense,
        amount: Number(newExpense.amount),
        category: suggestedCategory
      });
    } else {
      addExpense({
        ...newExpense.description,
        amount: Number(newExpense.amount),
        category: newExpense.category
      });
    }
    
    setNewExpense({ description: '', amount: '', category: 'Auto' });
  };
  
  const handleSetBudget = () => {
    if (budgetInput > 0) {
      setBudget(Number(budgetInput));
    }
  };
  
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.category || !newGoal.target) return;
    
    addGoal({
      category: newGoal.category,
      target: Number(newGoal.target)
    });
    
    setNewGoal({ category: 'Food', target: '' });
  };
  
  const handleAddRecurring = (e) => {
    e.preventDefault();
    if (!newRecurring.description || !newRecurring.amount) return;
    
    addRecurringExpense({
      ...newRecurring,
      amount: Number(newRecurring.amount),
      nextDue: new Date().toISOString().split('T')[0]
    });
    
    setNewRecurring({
      description: '',
      amount: '',
      category: 'Utilities',
      frequency: 'monthly',
      active: true
    });
  };
  
  const handleScanReceipt = async () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsScanning(true);
    try {
      const scannedData = await scanReceipt(file);
      if (scannedData) {
        setNewExpense({
          description: scannedData.description,
          amount: scannedData.amount.toString(),
          category: scannedData.category
        });
      }
    } catch (error) {
      console.error('Error scanning receipt:', error);
    } finally {
      setIsScanning(false);
      e.target.value = ''; // Reset file input
    }
  };
  
  const totalSpent = getTotalSpent();
  const remainingBudget = getRemainingBudget();
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const expensesByCategory = getExpensesByCategory();
  const monthlyTrend = getMonthlyTrend();
  const categoryInsights = getCategoryInsights();
  const forecast = getForecast(3);
  const savingsRecommendation = getSavingsRecommendation();
  const unreadAlerts = alerts.filter(alert => !alert.read);
  
  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger': return <FaExclamationTriangle className="text-red-500" />;
      case 'warning': return <FaExclamationTriangle className="text-yellow-500" />;
      case 'success': return <FaCheckCircle className="text-green-500" />;
      default: return <FaInfoCircle className="text-blue-500" />;
    }
  };
  
  const getAlertColor = (type) => {
    switch (type) {
      case 'danger': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <FaWallet className="text-primary-600" />
                Naija Expense Tracker Pro
              </h1>
              <p className="text-gray-600">Advanced financial management for Nigerians</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Currency Selector */}
              <select 
                value={selectedCurrency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.values(currencies).map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              
              {/* Alerts Button */}
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBell className="text-xl" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>
              
              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <FaDownload />
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 border-b border-gray-200">
            {['overview', 'analytics', 'goals', 'recurring', 'forecast'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                  activeTab === tab 
                    ? 'bg-white border border-b-0 border-gray-300 text-primary-600' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Alerts Panel */}
        {showAlerts && (
          <div className="mb-6 bg-white rounded-xl shadow-lg p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaBell className="text-primary-600" />
                Notifications ({alerts.length})
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={markAllAlertsAsRead}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Mark all read
                </button>
                <button
                  onClick={clearAllAlerts}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Clear all
                </button>
              </div>
            </div>
            
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {alerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${alert.read ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">{alert.title}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{alert.message}</p>
                        {!alert.read && (
                          <button
                            onClick={() => markAlertAsRead(alert.id)}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-800"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Budget Overview & Add Expense */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-primary-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Total Budget</h3>
                  <FaWallet className="text-primary-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(totalBudget)}
                </p>
                <div className="mt-4">
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                    placeholder="Enter new budget"
                  />
                  <button
                    onClick={handleSetBudget}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Update Budget
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-danger-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
                  <FaMoneyBillWave className="text-danger-500 text-xl" />
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(totalSpent)}
                </p>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-danger-500 to-danger-600 transition-all duration-500"
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {spentPercentage.toFixed(1)}% of budget
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-success-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Remaining</h3>
                  <FaChartLine className="text-success-500 text-xl" />
                </div>
                <p className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-gray-800' : 'text-danger-600'}`}>
                  {formatCurrency(remainingBudget)}
                </p>
                <p className={`text-sm mt-2 font-medium ${remainingBudget >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {remainingBudget >= 0 ? 'Within budget' : 'Over budget!'}
                </p>
              </div>
            </div>
            
            {/* Add Expense Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FaPlus className="text-primary-600" />
                  Add Expense
                </h2>
                <button
                  onClick={handleScanReceipt}
                  disabled={isScanning}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    isScanning 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors`}
                >
                  {isScanning ? (
                    <>
                      <FaRedo className="animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt />
                      Scan Receipt
                    </>
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="What did you spend on?"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ({currencies[selectedCurrency].symbol})
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-gray-500">{currencies[selectedCurrency].symbol}</span>
                      <input
                        type="number"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Auto">Auto-detect</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all shadow-lg"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              </form>
              
              {/* Quick Categories */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Quick categories:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setNewExpense({...newExpense, category})}
                      className={`px-3 py-2 rounded-lg border ${
                        newExpense.category === category 
                          ? 'bg-primary-100 border-primary-500 text-primary-700' 
                          : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaChartBar className="text-primary-600" />
                  Recent Expenses
                </h2>
                {expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <FaWallet className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No expenses yet. Add your first expense!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {expenses.slice().reverse().map((expense) => (
                      <div 
                        key={expense.id} 
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <FaTag className="text-primary-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{expense.description}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="bg-gray-200 px-2 py-1 rounded-md">
                                  {expense.category}
                                </span>
                                <span>{expense.date}</span>
                                {expense.isRecurring && (
                                  <span className="text-primary-600 flex items-center gap-1">
                                    <FaRedo /> Recurring
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-gray-800">
                            {formatCurrency(expense.amount)}
                          </span>
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Category Breakdown */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaChartBar className="text-primary-600" />
                    Category Breakdown
                  </h2>
                  <div className="space-y-4">
                    {expensesByCategory.map(({ category, amount, percentage }) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-700">{category}</span>
                          <span className="font-semibold text-gray-800">
                            {formatCurrency(amount)}
                            <span className="text-gray-500 text-sm ml-2">({percentage.toFixed(1)}%)</span>
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Monthly Trend */}
                {monthlyTrend.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FaChartLine className="text-success-600" />
                      Monthly Spending Trend
                    </h2>
                    <div className="space-y-4">
                      {monthlyTrend.map((month) => (
                        <div key={month.month} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-800">
                              {new Date(month.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <span className="font-bold text-primary-600">{formatCurrency(month.total)}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span>Avg: {formatCurrency(month.average)} • Items: {month.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right Column - Side Panels */}
          <div className="space-y-8">
            {/* Goals Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  {/* <FaTarget className="text-primary-600" /> */}
                  Spending Goals
                </h2>
                <button
                  onClick={() => setShowGoals(!showGoals)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {showGoals ? 'Hide' : 'Add'}
                </button>
              </div>
              
              {showGoals && (
                <form onSubmit={handleAddGoal} className="mb-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Amount
                    </label>
                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Enter target amount"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add Goal
                  </button>
                </form>
              )}
              
              <div className="space-y-4">
                {expenseGoals.map(goal => {
                  const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                  return (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{goal.category}</span>
                        <button
                          onClick={() => removeGoal(goal.id)}
                          className="text-gray-400 hover:text-danger-500"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span>{formatCurrency(goal.current)} / {formatCurrency(goal.target)}</span>
                        <span className="ml-2 font-semibold">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            progress > 90 ? 'bg-danger-500' : 
                            progress > 75 ? 'bg-warning-500' : 'bg-success-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Recurring Expenses */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaClock className="text-primary-600" />
                  Recurring Expenses
                </h2>
                <button
                  onClick={() => setShowRecurring(!showRecurring)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {showRecurring ? 'Hide' : 'Add'}
                </button>
              </div>
              
              {showRecurring && (
                <form onSubmit={handleAddRecurring} className="mb-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={newRecurring.description}
                    onChange={(e) => setNewRecurring({...newRecurring, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Description"
                    required
                  />
                  <input
                    type="number"
                    value={newRecurring.amount}
                    onChange={(e) => setNewRecurring({...newRecurring, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Amount"
                    required
                  />
                  <select
                    value={newRecurring.category}
                    onChange={(e) => setNewRecurring({...newRecurring, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={newRecurring.frequency}
                    onChange={(e) => setNewRecurring({...newRecurring, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add Recurring Expense
                  </button>
                </form>
              )}
              
              <div className="space-y-3">
                {recurringExpenses.map(exp => (
                  <div key={exp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{exp.description}</div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(exp.amount)} • {exp.frequency} • Due: {exp.nextDue}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRecurringExpense(exp.id)}
                        className={`p-1 rounded ${exp.active ? 'text-success-600' : 'text-gray-400'}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${exp.active ? 'bg-success-500' : 'bg-gray-300'}`} />
                      </button>
                      <button
                        onClick={() => removeRecurringExpense(exp.id)}
                        className="p-1 text-gray-400 hover:text-danger-500"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Savings Recommendation */}
            {savingsRecommendation && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl shadow-lg p-6 border border-green-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-green-600" />
                  Savings Tip
                </h2>
                <p className="text-gray-700 mb-3">{savingsRecommendation.reason}</p>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Current spending:</span>
                    <span className="font-semibold">{formatCurrency(savingsRecommendation.currentSpending)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential savings:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(savingsRecommendation.potentialMonthlySavings)}/month</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Forecast */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaChartLine className="text-primary-600" />
                  3-Month Forecast
                </h2>
                <button
                  onClick={() => setShowForecast(!showForecast)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {showForecast ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showForecast && (
                <div className="space-y-4">
                  {forecast.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{item.month}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          item.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Projected spending:</span>
                          <span className="font-medium">{formatCurrency(item.projectedSpending)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Projected remaining:</span>
                          <span className={`font-medium ${
                            item.projectedRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(item.projectedRemaining)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{expenses.length}</div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {expenses.length > 0 ? formatCurrency(totalSpent / expenses.length) : '₦0'}
                  </div>
                  <div className="text-sm text-gray-600">Average Expense</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {expensesByCategory.length}
                  </div>
                  <div className="text-sm text-gray-600">Categories Used</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {recurringExpenses.length}
                  </div>
                  <div className="text-sm text-gray-600">Recurring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;