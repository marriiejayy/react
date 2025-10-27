import { useState } from 'react';
import Header from './components/Header';
import AddExpenseForm from './components/AddExpenseForm';
import CategoryFilter from './components/CategoryFilter';
import ExpenseStats from './components/ExpenseStats';
import ExpenseList from './components/ExpenseList';
import './ExpenseTracker.css';

function App() {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: "Lunch at Mama Put",
      amount: 1500,
      category: "Food",
      date: "2025-01-15"
    },
    {
      id: 2,
      description: "Uber to work",
      amount: 1200,
      category: "Transport",
      date: "2025-01-15"
    },
    {
      id: 3,
      description: "Netflix Subscription",
      amount: 3600,
      category: "Entertainment",
      date: "2025-01-16"
    },
    {
      id: 4,
      description: "Electricity bills",
      amount: 36000,
      category: "Bills",
      date: "2025-01-16"
    }
  ]);
  
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  function addExpense(description, amount, category) {
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExpense]);
  }
  
  function deleteExpense(id) {
    setExpenses(expenses.filter(expense => expense.id !== id));
  }

  function editExpense(id, newDescription, newAmount) {
    setExpenses(expenses.map(expense =>
      expense.id === id 
        ? { ...expense, description: newDescription, amount: parseFloat(newAmount) }
        : expense
    ));
  }

  const filteredExpenses = categoryFilter === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === categoryFilter);
  
  return (
    <div className="app">
      <Header />
      <div className="container">
        <div className="left-panel">
          <AddExpenseForm onAddExpense={addExpense} />
          <ExpenseStats expenses={expenses} />
        </div>
        <div className="right-panel">
          <CategoryFilter 
            currentFilter={categoryFilter} 
            onFilterChange={setCategoryFilter} 
          />
          <ExpenseList 
            expenses={filteredExpenses}
            onDelete={deleteExpense}
            onEdit={editExpense}
          />
        </div>
      </div>
    </div>
  );
}

export default App;