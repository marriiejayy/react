import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LuDownload, LuLayoutDashboard } from "react-icons/lu";

// Dashboard Components
import SummaryGrid from './dashboard/SummaryGrid';
import TrendChart from './dashboard/TrendChart';
import CategoryPieChart from './dashboard/CategoryPieChart';
import CategoryTable from './dashboard/CategoryTable';
import CurrencyConverter from './dashboard/CurrencyConverter';
import DynamicTip from './dashboard/DynamicTip';
import ExpenseForm from './expenses/ExpenseForm';
import TransactionList from './expenses/TransactionList';
import DeleteModal from './dashboard/DeleteModal';

// Store
import useExpenseStore from '../store/expenseStore';

const ExpenseTracker = () => {
  const { expenses, formatCurrency, fetchRates } = useExpenseStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Auto-fetch rates on load
  useEffect(() => {
    fetchRates();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 135, 81);
    doc.text("Naija Tracker Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Description', 'Category', 'Amount']],
      body: expenses.map(e => [
        e.date, 
        e.description, 
        e.category, 
        formatCurrency(e.amount)
      ]),
      headStyles: { fillColor: [0, 135, 81] },
      theme: 'striped'
    });

    doc.save(`NaijaTracker_Statement.pdf`);
  };

  const handleFullReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-fade-in">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-naija-green text-white rounded-2xl shadow-lg shadow-success-100">
              <LuLayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Naija Expense Tracker</h1>
              <p className="text-gray-500 font-medium text-sm">Wealth management</p>
            </div>
          </div>
          
          <button 
            onClick={exportToPDF}
            className="flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            <LuDownload size={20} /> Export Statement
          </button>
        </header>

        <SummaryGrid />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visuals & History */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TrendChart />
              <CategoryPieChart />
            </div>
            <TransactionList />
          </div>

          {/* Sidebar Tools */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-8 space-y-6">
              <ExpenseForm />
              <CurrencyConverter />
              <CategoryTable />
              <DynamicTip />
              
              <button 
                onClick={() => setIsDeleteOpen(true)}
                className="w-full py-3 text-xs font-bold text-red-500 bg-white border border-red-100 rounded-2xl hover:bg-red-50 transition-colors"
              >
                Clear All Tracker Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleFullReset} 
      />
    </div>
  );
};

export default ExpenseTracker;