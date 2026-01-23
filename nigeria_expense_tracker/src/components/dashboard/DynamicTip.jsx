import React from 'react';
import { LuLightbulb } from "react-icons/lu";
import useExpenseStore from '../../store/expenseStore';

const DynamicTip = () => {
  const { getRemainingBudget, totalBudget } = useExpenseStore();
  const percentLeft = (getRemainingBudget() / totalBudget) * 100;

  let message = "Keep tracking your daily spending to stay on top of your goals!";
  if (percentLeft < 20) message = "Oshey! You've used over 80% of your budget. Time to start 'fasting' from outside food! 😅";
  if (percentLeft > 90) message = "Your budget is looking fresh! Remember to save some for rainy days.";

  return (
    <div className="p-6 rounded-3xl bg-primary-900 text-white shadow-xl relative overflow-hidden group">
      <div className="relative z-10">
        <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
          <LuLightbulb className="text-yellow-400" /> Naija Money Tip
        </h4>
        <p className="text-primary-100 text-sm leading-relaxed opacity-90">{message}</p>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-800 rounded-full blur-2xl group-hover:bg-success-600 transition-all duration-500"></div>
    </div>
  );
};

export default DynamicTip;