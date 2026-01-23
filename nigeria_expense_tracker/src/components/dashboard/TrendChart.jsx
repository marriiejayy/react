import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useExpenseStore from '../../store/expenseStore';

const TrendChart = () => {
  const { getMonthlyTrend, formatCurrency } = useExpenseStore();
  const data = getMonthlyTrend();

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Monthly Spending</h3>
      {/* FIX: Setting a fixed height of 250px on the container div */}
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#008751" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#008751" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => formatCurrency(value)}
            />
            <Area type="monotone" dataKey="total" stroke="#008751" strokeWidth={3} fill="url(#colorTotal)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;