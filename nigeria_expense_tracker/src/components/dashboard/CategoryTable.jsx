import React from 'react';
import { LuUtensils, LuCar, LuZap, LuShoppingBag, LuMoreHorizontal } from "react-icons/lu";
import useExpenseStore from '../../store/expenseStore';

const categoryIcons = {
  Food: { icon: <LuUtensils />, color: 'text-orange-500', bg: 'bg-orange-50' },
  Transport: { icon: <LuCar />, color: 'text-blue-500', bg: 'bg-blue-50' },
  Bills: { icon: <LuZap />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  Shopping: { icon: <LuShoppingBag />, color: 'text-purple-500', bg: 'bg-purple-50' },
  Other: { icon: <LuMoreHorizontal />, color: 'text-gray-500', bg: 'bg-gray-50' }
};

const CategoryTable = () => {
  const { expenses, formatCurrency, getTotalSpent } = useExpenseStore();
  const totalSpent = getTotalSpent();

  // Aggregate expenses by category
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4 text-gray-800 tracking-tight">Spending Breakdown</h3>
      <div className="space-y-4">
        {sortedCategories.length > 0 ? (
          sortedCategories.map(([category, amount]) => {
            const meta = categoryIcons[category] || categoryIcons.Other;
            const percentage = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(0) : 0;

            return (
              <div key={category} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${meta.bg} ${meta.color} transition-transform group-hover:scale-110`}>
                    {meta.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{category}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{percentage}% of spending</p>
                  </div>
                </div>
                <p className="font-black text-gray-900 text-sm">{formatCurrency(amount)}</p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400 py-4 text-sm italic">No data to display yet</p>
        )}
      </div>
    </div>
  );
};

export default CategoryTable;