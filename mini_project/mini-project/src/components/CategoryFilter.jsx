function CategoryFilter({ currentFilter, onFilterChange }) {
  const categories = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Others'];
  
  const getCategoryIcon = (cat) => {
    const icons = {
      'All': '',
      'Food': '',
      'Transport': '',
      'Bills': '',
      'Entertainment': '',
      'Others': ''
    };
    return icons[cat] || '';
  };
  
  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="filter-buttons">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${currentFilter === category ? 'active' : ''}`}
            onClick={() => onFilterChange(category)}
          >
            <span className="icon">{getCategoryIcon(category)}</span>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;