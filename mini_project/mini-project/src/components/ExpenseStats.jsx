function ExpenseStats({ expenses }) {
  // Calculate statistics
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExpenses = expenses.length;
  const highestExpense = expenses.length > 0 
    ? Math.max(...expenses.map(expense => expense.amount))
    : 0;
  
  // Calculate category breakdown
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };
  
  return (
    <div className="expense-stats">
      <h2>💰 Expense Summary</h2>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(totalAmount)}</div>
            <div className="stat-label">Total Spent</div>
          </div>
        </div>
        
        <div className="stat-card count">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{totalExpenses}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
        </div>
        
        <div className="stat-card highest">
          <div className="stat-icon">📈</div>
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
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(amount / totalAmount) * 100}%`,
                  backgroundColor: getCategoryColor(category)
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function for category colors
function getCategoryColor(category) {
  const colors = {
    'Food': '#ff6b6b',
    'Transport': '#4ecdc4',
    'Bills': '#45b7d1',
    'Entertainment': '#96ceb4',
    'Others': '#feca57'
  };
  return colors[category] || '#cccccc';
}

export default ExpenseStats;