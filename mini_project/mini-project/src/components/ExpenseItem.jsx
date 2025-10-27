import { useState } from 'react';

function ExpenseItem({ expense, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(expense.description);
  const [editAmount, setEditAmount] = useState(expense.amount.toString());
  
  function handleEdit() {
    if (editDescription.trim() === '' || editAmount === '' || parseFloat(editAmount) <= 0) {
      return;
    }
    onEdit(expense.id, editDescription, editAmount);
    setIsEditing(false);
  }
  
  function handleCancel() {
    setEditDescription(expense.description);
    setEditAmount(expense.amount.toString());
    setIsEditing(false);
  }
  
  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString('en-NG')}`;
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short'
    });
  };
  
  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '',
      'Transport': '',
      'Bills': '',
      'Entertainment': '',
      'Others': ''
    };
    return icons[category] || '';
  };
  
  return (
    <div className={`expense-item ${expense.category.toLowerCase()}`}>
      <div className="expense-icon">
        {getCategoryIcon(expense.category)}
      </div>
      
      <div className="expense-details">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="edit-input"
            />
            <input
              type="number"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="edit-input amount"
            />
          </div>
        ) : (
          <>
            <div className="expense-description">{expense.description}</div>
            <div className="expense-amount">{formatCurrency(expense.amount)}</div>
          </>
        )}
        
        <div className="expense-meta">
          <span className="expense-category">{expense.category}</span>
          <span className="expense-date">{formatDate(expense.date)}</span>
        </div>
      </div>
      
      <div className="expense-actions">
        {isEditing ? (
          <>
            <button onClick={handleEdit} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Delete</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button onClick={() => onDelete(expense.id)} className="delete-btn">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ExpenseItem;