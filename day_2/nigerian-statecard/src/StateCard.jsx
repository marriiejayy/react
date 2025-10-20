function StateCard({ state, capital, region, population, children }) {
  const getRegionColor = (region) => {
    const regionColors = {
      'North': '#8B4513',      
      'South': '#008751',     
      'East': '#FFD700',       
      'West': '#4169E1'       
    };
    return regionColors[region] || '#e0e0e0';
  };

  const cardStyle = {
    backgroundColor: getRegionColor(region),
    padding: '20px',
    margin: '10px',
    borderRadius: '8px',
    color: region === 'East' ? 'black' : 'white', 
    Width: '500px'
  };

  return (
    <div style={cardStyle}>
      <h2>{state} State</h2>
      <p><strong>Capital:</strong> {capital}</p>
      <p><strong>Region:</strong> {region}</p>
      <p><strong>Population:</strong> {population}</p>
      {children && (
        <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
          <strong>Famous Landmark:</strong> {children}
        </div>
      )}
    </div>
  );
}

export default StateCard;