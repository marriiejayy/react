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
        <h1> Expense Tracker</h1>
        <span className="date">{today}</span>
      </div>
    </header>
  );
}

export default Header;