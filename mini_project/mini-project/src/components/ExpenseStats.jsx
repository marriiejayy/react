function ExpenseStats({ expenses }) {

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = expenses.length;
  const highestExpense = expenses.length > 0 
    ? Math.max(...expenses.map(expense => expense.amount))
    : 0;
  

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };
  
  return (
    <div className="expense-stats">
      <h2> Expense Summary</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(totalAmount)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
        
        <div className="stat-card count">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-value">{totalExpenses}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
        </div>
        
        <div className="stat-card highest">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(highestExpense)}</div>
            <div className="stat-label">Highest Expense</div>
          </div>
        </div>
      </div>
      
      <div className="category-breakdown">
        <h3>Spending by Category</h3>
        {Object.entries(categoryTotals).map(([category, amount]) => (
          <div key={category} className="category-item">
            <div className="category-header">
              <span className="category-name">{category}</span>
              <span className="category-amount">{formatCurrency(amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseStats;