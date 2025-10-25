import { useState } from 'react';
import './StatesExplorer.css';

function StatesExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  const states = [
    { id: 1, name: 'Lagos', capital: 'Ikeja', region: 'South West' },
    { id: 2, name: 'Kano', capital: 'Kano', region: 'North West' },
    { id: 3, name: 'Rivers', capital: 'Port Harcourt', region: 'South South' },
    { id: 4, name: 'Oyo', capital: 'Ibadan', region: 'South West' },
    { id: 5, name: 'Kaduna', capital: 'Kaduna', region: 'North West' },
    { id: 6, name: 'Edo', capital: 'Benin City', region: 'South South' },
    { id: 7, name: 'Borno', capital: 'Maiduguri', region: 'North East' },
    { id: 8, name: 'Delta', capital: 'Asaba', region: 'South South' },
    { id: 9, name: 'Ogun', capital: 'Abeokuta', region: 'South West' },
    { id: 10, name: 'Plateau', capital: 'Jos', region: 'North Central' },
  ];


  const filteredStates = states.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         state.capital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || state.region === regionFilter;
    
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="states-explorer">
      <h1>Nigerian States Explorer</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by state name or capital..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

    
      <div className="region-filters">
        <button 
          className={regionFilter === 'all' ? 'active' : ''}
          onClick={() => setRegionFilter('all')}
        >
          All Regions
        </button>
        <button 
          className={regionFilter === 'South West' ? 'active' : ''}
          onClick={() => setRegionFilter('South West')}
        >
          South West
        </button>
        <button 
          className={regionFilter === 'North West' ? 'active' : ''}
          onClick={() => setRegionFilter('North West')}
        >
          North West
        </button>
        <button 
          className={regionFilter === 'South South' ? 'active' : ''}
          onClick={() => setRegionFilter('South South')}
        >
          South South
        </button>
        <button 
          className={regionFilter === 'North East' ? 'active' : ''}
          onClick={() => setRegionFilter('North East')}
        >
          North East
        </button>
        <button 
          className={regionFilter === 'South East' ? 'active' : ''}
          onClick={() => setRegionFilter('South East')}
        >
          South East
        </button>
      </div>

      
      <p className="results-count">
        Showing {filteredStates.length} of {states.length} states
      </p>

    
      {filteredStates.length === 0 ? (
        <div className="empty-state">
          <p>No states found matching your criteria.</p>
        </div>
      ) : (
        <div className="states-grid">
          {filteredStates.map(state => (
            <div key={state.id} className="state-card">
              <h3>{state.name}</h3>
              <div className="state-info">
                <p><strong>Capital:</strong> {state.capital}</p>
                <p><strong>Region:</strong> {state.region}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatesExplorer;