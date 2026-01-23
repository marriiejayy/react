import React, { useState } from 'react';
import { LuWallet, LuTrendingUp, LuScale, LuSettings2 } from "react-icons/lu";
import useExpenseStore from '../../store/expenseStore';
import BudgetModal from './BudgetModal';

const SummaryGrid = () => {
  const { getTotalSpent, getRemainingBudget, formatCurrency, totalBudget } = useExpenseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Budget Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Monthly Budget</p>
            <h2 className="text-2xl font-black text-gray-900">{formatCurrency(totalBudget)}</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-3 rounded-2xl bg-gray-50 text-gray-400 hover:text-naija-green hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100"
          >
            <LuSettings2 size={20} />
          </button>
        </div>

        {/* Total Spent Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Spent</p>
            <h2 className="text-2xl font-black text-danger-600">{formatCurrency(getTotalSpent())}</h2>
          </div>
          <div className="p-3 rounded-2xl bg-danger-50 text-danger-600">
            <LuTrendingUp size={24} />
          </div>
        </div>

        {/* Remaining Balance Card */}
        <div className={`p-6 rounded-3xl shadow-sm border flex items-center justify-between transition-colors ${
          getRemainingBudget() < 0 ? 'bg-danger-50 border-danger-100' : 'bg-success-50 border-success-100'
        }`}>
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
              getRemainingBudget() < 0 ? 'text-danger-700' : 'text-success-700'
            }`}>Balance</p>
            <h2 className={`text-2xl font-black ${
              getRemainingBudget() < 0 ? 'text-danger-800' : 'text-success-800'
            }`}>{formatCurrency(getRemainingBudget())}</h2>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 text-success-700">
            <LuScale size={24} />
          </div>
        </div>
      </div>

      {/* The Modal */}
      <BudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default SummaryGrid;