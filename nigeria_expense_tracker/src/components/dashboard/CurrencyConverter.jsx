import React, { useEffect } from 'react';
import { LuRefreshCw, LuGlobe } from "react-icons/lu";
import useExpenseStore from '../../store/expenseStore';

const CurrencyConverter = () => {
  const { displayCurrency, setDisplayCurrency, fetchRates, exchangeRates } = useExpenseStore();

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <LuGlobe size={18} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm">FX View</h3>
        </div>
        <button onClick={fetchRates} className="text-gray-400 hover:rotate-180 transition-transform duration-500">
          <LuRefreshCw size={14} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-2xl">
        {['NGN', 'USD', 'GBP'].map((cur) => (
          <button
            key={cur}
            onClick={() => setDisplayCurrency(cur)}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              displayCurrency === cur 
                ? 'bg-white text-naija-green shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {cur}
          </button>
        ))}
      </div>
      
      {displayCurrency !== 'NGN' && (
        <p className="mt-3 text-[10px] text-center text-gray-400 font-medium">
          Rate: 1 NGN = {exchangeRates[displayCurrency]?.toFixed(6)} {displayCurrency}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;