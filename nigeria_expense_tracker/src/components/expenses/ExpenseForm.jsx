import React, { useState } from 'react';
import { LuPlusCircle, LuTag, LuBanknote } from "react-icons/lu";
import useExpenseStore from '../../store/expenseStore';

const ExpenseForm = () => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const { addExpense, categorizeExpense } = useExpenseStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc || !amount) return;
    const category = await categorizeExpense(desc);
    addExpense({ description: desc, amount: parseFloat(amount), category });
    setDesc(''); setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <LuPlusCircle className="text-naija-green" /> Add Expense
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <LuTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (e.g. Fuel)"
            className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-naija-green"
          />
        </div>
        <div className="relative">
          <LuBanknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-naija-green font-bold"
          />
        </div>
        <button className="w-full bg-naija-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-success-700 transition-all">
          <LuPlusCircle /> Log Transaction
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;