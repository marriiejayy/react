import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, onDelete, onEdit }) {
  if (expenses.length === 0) {
    return (
      <div className="expense-list empty">
        <div className="empty-state">
          <div className="empty-icon">💰</div>
          <h3>No expenses found</h3>
          <p>Add your first expense to get started!</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="expense-list">
      <h2>Recent Expenses</h2>
      <div className="expenses-container">
        {expenses.map(expense => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;