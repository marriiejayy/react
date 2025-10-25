function TodoFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div className="filter">
      <p>Filter:</p>
      {filters.map(filter => (
        <button className="btn-filters"
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          style={{
            fontWeight: currentFilter === filter.key ? 'bold' : 'normal',
            margin: '0 5px'
          }}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default TodoFilter;