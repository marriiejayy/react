import React, { useState } from 'react';
import { LuX, LuCheck, LuCoins } from "react-icons/lu";
import useExpenseStore from '../../store/expenseStore';

const BudgetModal = ({ isOpen, onClose }) => {
  const { totalBudget, updateBudget } = useExpenseStore();
  const [amount, setAmount] = useState(totalBudget);

  if (!isOpen) return null;

  const handleSave = () => {
    updateBudget(Number(amount));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Edit Monthly Budget</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <LuX size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r pr-3 border-gray-200">
              <LuCoins className="text-naija-green" size={20} />
              <span className="font-bold text-gray-400">₦</span>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-20 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-naija-green outline-none font-bold text-xl transition-all"
              autoFocus
            />
          </div>
          
          <button
            onClick={handleSave}
            className="w-full bg-naija-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-success-700 shadow-lg shadow-success-100 transition-all active:scale-[0.98]"
          >
            <LuCheck size={20} /> Save New Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;