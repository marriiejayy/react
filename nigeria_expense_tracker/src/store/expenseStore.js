import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      totalBudget: 600000,
      displayCurrency: 'NGN',
      exchangeRates: { USD: 0.00065, GBP: 0.00052 },

      // --- Budget & Currency Actions ---
      updateBudget: (amount) => set({ totalBudget: amount }),
      
      setDisplayCurrency: (currency) => set({ displayCurrency: currency }),

      fetchRates: async () => {
        try {
          const res = await fetch('https://open.er-api.com/v6/latest/NGN');
          const data = await res.json();
          if (data && data.rates) {
            set({ exchangeRates: { USD: data.rates.USD, GBP: data.rates.GBP } });
          }
        } catch (error) {
          console.error("FX Rate fetch failed, using fallback rates.");
        }
      },

      // --- Expense Actions ---
      addExpense: (expense) => {
        const category = get().categorizeExpense(expense.description);
        set((state) => ({
          expenses: [...state.expenses, { 
            ...expense, 
            category,
            id: Date.now(), 
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString() 
          }]
        }));
      },

      removeExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),

      editExpense: (id, updatedData) => set((state) => ({
        expenses: state.expenses.map((exp) => {
          if (exp.id === id) {
            const category = updatedData.description 
              ? get().categorizeExpense(updatedData.description) 
              : exp.category;
            return { ...exp, ...updatedData, category };
          }
          return exp;
        })
      })),

      // --- Helper Logic ---
      categorizeExpense: (description) => {
        const desc = description.toLowerCase();
        const keywords = {
          Food: ['lunch', 'dinner', 'suya', 'bole', 'mama put', 'grocery', 'eat', 'kfc', 'food', 'restaurant'],
          Transport: ['uber', 'bolt', 'fuel', 'petrol', 'keke', 'danfo', 'transport', 'flight', 'bus'],
          Bills: ['nepa', 'ekedc', 'ikedc', 'data', 'mtn', 'glo', 'dstv', 'internet', 'rent', 'airtime', 'utility'],
          Shopping: ['jumia', 'konga', 'mall', 'amazon', 'clothes', 'thrift', 'supermarket'],
        };
        for (const [category, words] of Object.entries(keywords)) {
          if (words.some(word => desc.includes(word))) return category;
        }
        return 'Other';
      },

      getTotalSpent: () => get().expenses.reduce((sum, e) => sum + e.amount, 0),
      
      getRemainingBudget: () => get().totalBudget - get().getTotalSpent(),
      
      formatCurrency: (amount) => {
        const { displayCurrency, exchangeRates } = get();
        let convertedAmount = amount;
        
        if (displayCurrency !== 'NGN') {
          convertedAmount = amount * (exchangeRates[displayCurrency] || 1);
        }

        return new Intl.NumberFormat(displayCurrency === 'NGN' ? 'en-NG' : 'en-US', {
          style: 'currency',
          currency: displayCurrency,
          maximumFractionDigits: displayCurrency === 'NGN' ? 0 : 2,
        }).format(convertedAmount);
      },

      getMonthlyTrend: () => {
        const expenses = get().expenses;
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trendData = expenses.reduce((acc, exp) => {
          const monthName = months[new Date(exp.timestamp).getMonth()];
          const existing = acc.find(d => d.month === monthName);
          if (existing) { existing.total += exp.amount; } 
          else { acc.push({ month: monthName, total: exp.amount }); }
          return acc;
        }, []);
        return trendData.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
      },
    }),
    { name: 'naija-tracker-storage' }
  )
);

export default useExpenseStore;