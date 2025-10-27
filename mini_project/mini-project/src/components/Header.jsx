function Header() {
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <header className="header">
      <div className="header-content">
        <h1>💰 Naija Expense Tracker</h1>
        <p>Track your spending like a pro!</p>
        <span className="date">{today}</span>
      </div>
    </header>
  );
}

export default Header;