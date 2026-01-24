// src/components/AnalyticsDashboard.jsx
import React from 'react';
import { FaChartBar, FaUsers, FaClock, FaFileDownload } from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsDashboard = () => {
  const usageData = [
    { name: 'Mon', documents: 12, queries: 45 },
    { name: 'Tue', documents: 19, queries: 52 },
    { name: 'Wed', documents: 15, queries: 38 },
    { name: 'Thu', documents: 25, queries: 61 },
    { name: 'Fri', documents: 22, queries: 55 },
    { name: 'Sat', documents: 8, queries: 22 },
    { name: 'Sun', documents: 5, queries: 18 },
  ];

  const documentTypes = [
    { name: 'PDF', value: 45, color: '#ef4444' },
    { name: 'Word', value: 25, color: '#3b82f6' },
    { name: 'Excel', value: 15, color: '#10b981' },
    { name: 'Images', value: 10, color: '#8b5cf6' },
    { name: 'Others', value: 5, color: '#f59e0b' },
  ];

  const stats = [
    { label: 'Total Documents', value: '156', icon: <FaChartBar />, change: '+12%' },
    { label: 'Active Users', value: '24', icon: <FaUsers />, change: '+5%' },
    { label: 'Avg Response Time', value: '1.2s', icon: <FaClock />, change: '-0.3s' },
    { label: 'Downloads', value: '892', icon: <FaFileDownload />, change: '+23%' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Weekly Usage</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="documents" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="queries" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Types Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Document Types</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={documentTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};