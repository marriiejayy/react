import { useState } from 'react';

function AddExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  
  function handleSubmit(e) {
    e.preventDefault();
    
    if (description.trim() === '' || amount === '' || parseFloat(amount) <= 0) {
      alert('Please enter valid description and amount!');
      return;
    }
    
    onAddExpense(description, amount, category);
    setDescription('');
    setAmount('');
    setCategory('Food');
  }
  
  return (
    <div className="add-expense-form">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="What did you spend on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label>Amount (₦)</label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Food"> Food</option>
            <option value="Transport"> Transport</option>
            <option value="Bills"> Bills</option>
            <option value="Entertainment"> Entertainment</option>
            <option value="Others"> Others</option>
          </select>
        </div>
        
        <button type="submit" className="add-btn">
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default AddExpenseForm;