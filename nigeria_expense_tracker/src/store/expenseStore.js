// src/store/expenseStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Helper function to format Nigerian Naira
const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

const useExpenseStore = create(
  persist(
    (set, get) => ({
      // State
      expenses: [],
      totalBudget: 500000,
      expenseGoals: [
        { id: 1, category: 'Food', target: 50000, current: 0 },
        { id: 2, category: 'Transport', target: 30000, current: 0 },
        { id: 3, category: 'Entertainment', target: 20000, current: 0 },
      ],
      recurringExpenses: [
        {
          id: 1,
          description: 'Monthly Rent',
          amount: 150000,
          category: 'Rent',
          frequency: 'monthly',
          nextDue: new Date().toISOString().split('T')[0],
          active: true
        },
        {
          id: 2,
          description: 'Internet Bill',
          amount: 25000,
          category: 'Utilities',
          frequency: 'monthly',
          nextDue: new Date().toISOString().split('T')[0],
          active: true
        }
      ],
      alerts: [],
      currencies: {
        NGN: { code: 'NGN', symbol: '₦', rate: 1, name: 'Nigerian Naira' },
        USD: { code: 'USD', symbol: '$', rate: 1500, name: 'US Dollar' },
        EUR: { code: 'EUR', symbol: '€', rate: 1600, name: 'Euro' },
        GBP: { code: 'GBP', symbol: '£', rate: 1800, name: 'British Pound' },
      },
      selectedCurrency: 'NGN',
      
      // Basic Actions
      addExpense: (expense) => set((state) => {
        const newExpenses = [...state.expenses, {
          id: Date.now(),
          date: new Date().toISOString().split('T')[0],
          ...expense,
        }];
        
        // Update goal progress automatically
        const updatedGoals = state.expenseGoals.map(goal => {
          if (goal.category === expense.category) {
            return { ...goal, current: goal.current + expense.amount };
          }
          return goal;
        });
        
        // Check for alerts after adding expense
        setTimeout(() => get().checkAlerts(), 100);
        
        return { 
          expenses: newExpenses,
          expenseGoals: updatedGoals
        };
      }),
      
      removeExpense: (id) => set((state) => {
        const expenseToRemove = state.expenses.find(exp => exp.id === id);
        if (!expenseToRemove) return state;
        
        const newExpenses = state.expenses.filter((expense) => expense.id !== id);
        
        // Update goal progress
        const updatedGoals = state.expenseGoals.map(goal => {
          if (goal.category === expenseToRemove.category) {
            return { ...goal, current: Math.max(0, goal.current - expenseToRemove.amount) };
          }
          return goal;
        });
        
        return { 
          expenses: newExpenses,
          expenseGoals: updatedGoals
        };
      }),
      
      setBudget: (amount) => set({ totalBudget: amount }),
      
      clearAllExpenses: () => set({ expenses: [] }),
      
      // Computed Values
      getTotalSpent: () => {
        const { expenses } = get();
        return expenses.reduce((total, expense) => total + expense.amount, 0);
      },
      
      getRemainingBudget: () => {
        const { totalBudget } = get();
        const totalSpent = get().getTotalSpent();
        return totalBudget - totalSpent;
      },
      
      getExpensesByCategory: () => {
        const { expenses } = get();
        const categories = {};
        
        expenses.forEach(expense => {
          if (!categories[expense.category]) {
            categories[expense.category] = 0;
          }
          categories[expense.category] += expense.amount;
        });
        
        return Object.entries(categories).map(([category, amount]) => ({
          category,
          amount,
          percentage: expenses.length > 0 ? (amount / get().getTotalSpent()) * 100 : 0
        }));
      },
      
      // Advanced Analytics
      getMonthlyTrend: () => {
        const { expenses } = get();
        const monthlyData = {};
        
        expenses.forEach(expense => {
          const month = expense.date.substring(0, 7); // YYYY-MM
          if (!monthlyData[month]) {
            monthlyData[month] = { total: 0, count: 0, categories: {} };
          }
          monthlyData[month].total += expense.amount;
          monthlyData[month].count += 1;
          
          if (!monthlyData[month].categories[expense.category]) {
            monthlyData[month].categories[expense.category] = 0;
          }
          monthlyData[month].categories[expense.category] += expense.amount;
        });
        
        return Object.entries(monthlyData).map(([month, data]) => ({
          month,
          ...data,
          average: data.count > 0 ? data.total / data.count : 0
        }));
      },
      
      getCategoryInsights: () => {
        const { expenses } = get();
        const categoryStats = {};
        
        expenses.forEach(expense => {
          if (!categoryStats[expense.category]) {
            categoryStats[expense.category] = {
              total: 0,
              count: 0,
              max: 0,
              min: Infinity,
              lastExpense: null
            };
          }
          categoryStats[expense.category].total += expense.amount;
          categoryStats[expense.category].count += 1;
          categoryStats[expense.category].max = Math.max(categoryStats[expense.category].max, expense.amount);
          categoryStats[expense.category].min = Math.min(categoryStats[expense.category].min, expense.amount);
          categoryStats[expense.category].lastExpense = expense.date;
        });
        
        return Object.entries(categoryStats).map(([category, stats]) => ({
          category,
          ...stats,
          average: stats.count > 0 ? stats.total / stats.count : 0
        }));
      },
      
      // Expense Goals
      addGoal: (goal) => set((state) => ({
        expenseGoals: [...state.expenseGoals, {
          id: Date.now(),
          current: 0,
          ...goal
        }]
      })),
      
      removeGoal: (id) => set((state) => ({
        expenseGoals: state.expenseGoals.filter(goal => goal.id !== id)
      })),
      
      updateGoalProgress: () => set((state) => {
        const categoryTotals = {};
        
        state.expenses.forEach(expense => {
          if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
          }
          categoryTotals[expense.category] += expense.amount;
        });
        
        const updatedGoals = state.expenseGoals.map(goal => ({
          ...goal,
          current: categoryTotals[goal.category] || 0
        }));
        
        return { expenseGoals: updatedGoals };
      }),
      
      // Smart Categorization
      categorizeExpense: async (description) => {
        try {
          const categories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Healthcare', 'Rent'];
          const keywords = {
            'Food': ['restaurant', 'food', 'meal', 'grocery', 'supermarket', 'eat', 'chop', 'canteen', 'kitchen'],
            'Transport': ['uber', 'bolt', 'taxi', 'fuel', 'transport', 'bus', 'car', 'keke', 'okada', 'train'],
            'Utilities': ['light', 'electricity', 'water', 'internet', 'data', 'airtime', 'bill', 'nepa', 'phcn'],
            'Shopping': ['buy', 'shop', 'mall', 'market', 'clothes', 'shoes', 'wear', 'fashion', 'store'],
            'Entertainment': ['movie', 'cinema', 'club', 'party', 'concert', 'game', 'sport', 'show', 'fun'],
            'Healthcare': ['hospital', 'drug', 'pharmacy', 'doctor', 'clinic', 'health', 'medical'],
            'Rent': ['rent', 'house', 'apartment', 'accomodation', 'landlord']
          };
          
          const desc = description.toLowerCase();
          let bestMatch = 'Others';
          let maxMatches = 0;
          
          Object.entries(keywords).forEach(([category, words]) => {
            const matches = words.filter(word => desc.includes(word)).length;
            if (matches > maxMatches) {
              maxMatches = matches;
              bestMatch = category;
            }
          });
          
          return bestMatch;
        } catch (error) {
          return 'Others';
        }
      },
      
      // Reports & Export
      generateReport: (type = 'monthly') => {
        const { expenses, totalBudget, selectedCurrency } = get();
        const totalSpent = get().getTotalSpent();
        const remaining = get().getRemainingBudget();
        
        const report = {
          summary: {
            totalBudget,
            totalSpent,
            remaining,
            totalExpenses: expenses.length,
            period: type,
            currency: selectedCurrency,
            generatedAt: new Date().toISOString()
          },
          byCategory: get().getExpensesByCategory(),
          monthlyTrend: type === 'monthly' ? get().getMonthlyTrend() : null,
          topExpenses: [...expenses]
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10),
          categoryInsights: get().getCategoryInsights()
        };
        
        return report;
      },
      
      exportToCSV: () => {
        const { expenses, selectedCurrency } = get();
        const currencySymbol = get().currencies[selectedCurrency].symbol;
        
        const headers = ['Date', 'Description', 'Category', `Amount (${currencySymbol})`, 'ID'];
        const csvRows = [
          headers.join(','),
          ...expenses.map(exp => 
            [exp.date, `"${exp.description}"`, exp.category, exp.amount, exp.id].join(',')
          )
        ];
        
        const csv = csvRows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        return true;
      },
      
      // Recurring Expenses
      addRecurringExpense: (expense) => set((state) => ({
        recurringExpenses: [...state.recurringExpenses, {
          id: Date.now(),
          ...expense
        }]
      })),
      
      removeRecurringExpense: (id) => set((state) => ({
        recurringExpenses: state.recurringExpenses.filter(exp => exp.id !== id)
      })),
      
      toggleRecurringExpense: (id) => set((state) => ({
        recurringExpenses: state.recurringExpenses.map(exp => 
          exp.id === id ? { ...exp, active: !exp.active } : exp
        )
      })),
      
      processRecurringExpenses: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const dueExpenses = state.recurringExpenses.filter(
          exp => exp.nextDue <= today && exp.active
        );
        
        if (dueExpenses.length === 0) return state;
        
        const newExpenses = dueExpenses.map(exp => ({
          description: exp.description,
          amount: exp.amount,
          category: exp.category,
          date: today,
          isRecurring: true,
          recurringId: exp.id
        }));
        
        // Calculate next due date
        const updatedRecurring = state.recurringExpenses.map(exp => {
          if (exp.nextDue <= today && exp.active) {
            const nextDate = new Date(exp.nextDue);
            if (exp.frequency === 'monthly') {
              nextDate.setMonth(nextDate.getMonth() + 1);
            } else if (exp.frequency === 'weekly') {
              nextDate.setDate(nextDate.getDate() + 7);
            } else if (exp.frequency === 'yearly') {
              nextDate.setFullYear(nextDate.getFullYear() + 1);
            }
            return { ...exp, nextDue: nextDate.toISOString().split('T')[0] };
          }
          return exp;
        });
        
        // Add the new expenses
        setTimeout(() => {
          newExpenses.forEach(expense => {
            get().addExpense(expense);
          });
        }, 0);
        
        return {
          recurringExpenses: updatedRecurring
        };
      }),
      
      // Budget Forecasting
      getForecast: (months = 3) => {
        const { expenses, totalBudget } = get();
        const monthlyAverage = get().getMonthlyTrend();
        
        if (monthlyAverage.length === 0) return [];
        
        const avgSpending = monthlyAverage.reduce((sum, month) => sum + month.total, 0) / monthlyAverage.length;
        
        const forecast = [];
        const today = new Date();
        
        for (let i = 1; i <= months; i++) {
          const forecastDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
          const monthStr = forecastDate.toISOString().substring(0, 7);
          
          forecast.push({
            month: monthStr,
            projectedSpending: avgSpending,
            projectedRemaining: totalBudget - avgSpending,
            riskLevel: avgSpending > totalBudget * 0.8 ? 'high' : avgSpending > totalBudget * 0.6 ? 'medium' : 'low'
          });
        }
        
        return forecast;
      },
      
      getSavingsRecommendation: () => {
        const totalSpent = get().getTotalSpent();
        const { totalBudget } = get();
        const expensesByCategory = get().getExpensesByCategory();
        
        if (expensesByCategory.length === 0) return null;
        
        const topCategory = expensesByCategory.sort((a, b) => b.amount - a.amount)[0];
        const savingsPotential = topCategory.amount * 0.1;
        
        return {
          category: topCategory.category,
          currentSpending: topCategory.amount,
          suggestedCut: savingsPotential,
          potentialMonthlySavings: savingsPotential,
          reason: `You spend the most on ${topCategory.category}. Reducing by 10% could save you ${formatNaira(savingsPotential)} monthly.`
        };
      },
      
      // Notifications & Alerts
      checkAlerts: () => {
        const { expenses, totalBudget, expenseGoals } = get();
        const totalSpent = get().getTotalSpent();
        const newAlerts = [];
        
        // Budget alerts
        const budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
        if (budgetPercentage > 90) {
          newAlerts.push({
            id: Date.now(),
            type: 'danger',
            title: 'Budget Warning',
            message: `You've spent ${budgetPercentage.toFixed(1)}% of your monthly budget!`,
            timestamp: new Date().toISOString(),
            read: false
          });
        } else if (budgetPercentage > 75) {
          newAlerts.push({
            id: Date.now(),
            type: 'warning',
            title: 'Budget Alert',
            message: `You've spent ${budgetPercentage.toFixed(1)}% of your budget. Consider slowing down.`,
            timestamp: new Date().toISOString(),
            read: false
          });
        }
        
        // Goal alerts
        expenseGoals.forEach(goal => {
          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
          if (progress > 90) {
            newAlerts.push({
              id: Date.now(),
              type: 'danger',
              title: 'Goal Alert',
              message: `${goal.category} spending is at ${progress.toFixed(1)}% of your goal (${formatNaira(goal.target)})`,
              timestamp: new Date().toISOString(),
              read: false
            });
          } else if (progress > 75) {
            newAlerts.push({
              id: Date.now(),
              type: 'warning',
              title: 'Goal Warning',
              message: `${goal.category} spending is at ${progress.toFixed(1)}% of your goal`,
              timestamp: new Date().toISOString(),
              read: false
            });
          }
        });
        
        // Large expense alert
        const largeExpenses = expenses.filter(exp => exp.amount > totalBudget * 0.1);
        if (largeExpenses.length > 0 && expenses.length > 5) {
          newAlerts.push({
            id: Date.now(),
            type: 'info',
            title: 'Large Expense Detected',
            message: `You have ${largeExpenses.length} expense(s) exceeding 10% of your budget`,
            timestamp: new Date().toISOString(),
            read: false
          });
        }
        
        if (newAlerts.length > 0) {
          set((state) => ({
            alerts: [...newAlerts, ...state.alerts].slice(0, 20) // Keep only last 20 alerts
          }));
        }
        
        return newAlerts;
      },
      
      markAlertAsRead: (alertId) => set((state) => ({
        alerts: state.alerts.map(alert => 
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      })),
      
      markAllAlertsAsRead: () => set((state) => ({
        alerts: state.alerts.map(alert => ({ ...alert, read: true }))
      })),
      
      clearAllAlerts: () => set({ alerts: [] }),
      
      // Multi-Currency Support
      setCurrency: (currencyCode) => set({ selectedCurrency: currencyCode }),
      
      convertAmount: (amount, fromCurrency = 'NGN', toCurrency = null) => {
        const { currencies, selectedCurrency } = get();
        const targetCurrency = toCurrency || selectedCurrency;
        
        if (fromCurrency === targetCurrency) return amount;
        
        const fromRate = currencies[fromCurrency]?.rate || 1;
        const toRate = currencies[targetCurrency]?.rate || 1;
        
        return (amount / fromRate) * toRate;
      },
      
      formatCurrency: (amount, currencyCode = null) => {
        const { currencies, selectedCurrency } = get();
        const currency = currencyCode ? currencies[currencyCode] : currencies[selectedCurrency];
        
        if (!currency) return formatNaira(amount);
        
        const convertedAmount = get().convertAmount(amount, 'NGN', currency.code);
        
        if (currency.code === 'NGN') {
          return formatNaira(convertedAmount);
        }
        
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency.code,
          minimumFractionDigits: 2,
        }).format(convertedAmount);
      },
      
      // Receipt Scanning (Mock)
      scanReceipt: async (imageFile) => {
        try {
          // Simulate API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock response based on Nigerian context
          const mockResponses = [
            {
              description: 'Supermarket Groceries',
              amount: Math.floor(Math.random() * 50000) + 5000,
              category: 'Food',
              date: new Date().toISOString().split('T')[0],
              merchant: 'Shoprite'
            },
            {
              description: 'Fuel Purchase',
              amount: Math.floor(Math.random() * 30000) + 5000,
              category: 'Transport',
              date: new Date().toISOString().split('T')[0],
              merchant: 'NNPC Station'
            },
            {
              description: 'Restaurant Bill',
              amount: Math.floor(Math.random() * 20000) + 3000,
              category: 'Food',
              date: new Date().toISOString().split('T')[0],
              merchant: 'Local Restaurant'
            }
          ];
          
          return mockResponses[Math.floor(Math.random() * mockResponses.length)];
        } catch (error) {
          console.error('Receipt scanning failed:', error);
          return null;
        }
      },
    }),
    {
      name: 'nigerian-expense-tracker-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        expenses: state.expenses,
        totalBudget: state.totalBudget,
        expenseGoals: state.expenseGoals,
        recurringExpenses: state.recurringExpenses,
        selectedCurrency: state.selectedCurrency,
      }),
    }
  )
);

export default useExpenseStore;