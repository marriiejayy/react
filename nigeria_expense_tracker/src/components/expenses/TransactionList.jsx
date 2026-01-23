import React, { useState } from 'react';
import { 
  LuSearch, 
  LuTrash2, 
  LuPencil, 
  LuCheckCircle, 
  LuXCircle, 
  LuUtensils, 
  LuCar, 
  LuZap, 
  LuShoppingBag, 
  LuMoreHorizontal 
} from "react-icons/lu";
import useExpenseStore from '../../store/expenseStore';

const categoryIcons = {
  Food: <LuUtensils className="text-orange-500" />,
  Transport: <LuCar className="text-blue-500" />,
  Bills: <LuZap className="text-yellow-500" />,
  Shopping: <LuShoppingBag className="text-purple-500" />,
  Other: <LuMoreHorizontal className="text-gray-500" />
};

const TransactionList = () => {
  const { expenses, removeExpense, editExpense, formatCurrency } = useExpenseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '' });

  const handleEditClick = (exp) => {
    setEditingId(exp.id);
    setEditForm({ description: exp.description, amount: exp.amount });
  };

  const handleSaveEdit = (id) => {
    editExpense(id, { 
      description: editForm.description, 
      amount: Number(editForm.amount) 
    });
    setEditingId(null);
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search & Header */}
      <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-gray-800">History</h3>
          <p className="text-xs text-gray-400 font-medium">{filteredExpenses.length} transactions found</p>
        </div>
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-naija-green w-full md:w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-50">
            {/* Sorting by timestamp to keep newest on top */}
            {[...filteredExpenses].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  {editingId === exp.id ? (
                    <input 
                      className="w-full p-2 border-2 border-naija-green/30 rounded-lg text-sm outline-none focus:border-naija-green"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-50 rounded-lg text-lg">
                        {categoryIcons[exp.category] || categoryIcons.Other}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{exp.description}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
                          {exp.category} • {exp.date}
                        </p>
                      </div>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  {editingId === exp.id ? (
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-xs font-bold text-gray-400">₦</span>
                      <input 
                        type="number"
                        className="w-24 p-2 border-2 border-naija-green/30 rounded-lg text-sm text-right outline-none focus:border-naija-green"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                      />
                    </div>
                  ) : (
                    <span className="font-black text-gray-900">{formatCurrency(exp.amount)}</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {editingId === exp.id ? (
                      <>
                        <button 
                          onClick={() => handleSaveEdit(exp.id)} 
                          className="p-2 text-naija-green hover:bg-success-50 rounded-lg transition-colors"
                          title="Save Changes"
                        >
                          <LuCheckCircle size={20} />
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <LuXCircle size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEditClick(exp)} 
                          className="p-2 text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <LuPencil size={18} />
                        </button>
                        <button 
                          onClick={() => removeExpense(exp.id)} 
                          className="p-2 text-gray-300 hover:text-danger-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredExpenses.length === 0 && (
          <div className="p-16 text-center">
            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
              <LuSearch size={24} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">No transactions match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;