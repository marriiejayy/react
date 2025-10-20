import StateCard from './StateCard';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '20px' }}>
      <StateCard 
        state="Lagos" 
        capital="Ikeja" 
        region="West" 
        population="14 million" 
        
      >
        Third Mainland Bridge
      </StateCard>
      
      <StateCard 
        state="Kano" 
        capital="Kano" 
        region="North" 
        population="13 million" 
      >
        Kurmi Market
      </StateCard>
      
      <StateCard 
        state="Rivers" 
        capital="Port Harcourt" 
        region="South" 
        population="7 million" 
      >
        Port Harcourt Tourist Beach
      </StateCard>
      
      <StateCard 
        state="Enugu" 
        capital="Enugu" 
        region="East" 
        population="4 million" 
      >
        Miliken Hill
      </StateCard>
    </div>
  );
}

export default App;