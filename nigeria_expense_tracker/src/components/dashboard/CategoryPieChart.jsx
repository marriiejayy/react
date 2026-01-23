import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useExpenseStore from '../../store/expenseStore';

const COLORS = ['#008751', '#0ea5e9', '#f59e0b', '#ef4444', '#6366f1'];

const CategoryPieChart = () => {
  const { expenses } = useExpenseStore();

  const data = expenses.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) { found.value += curr.amount; }
    else { acc.push({ name: curr.category, value: curr.amount }); }
    return acc;
  }, []);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Categories</h3>
      {/* FIX: Setting a fixed height of 250px here as well */}
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.length > 0 ? data : [{ name: 'No Data', value: 1 }]}
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={8}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryPieChart;