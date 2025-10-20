import GreetingCard from './GreetingCard';

function App() {
  return (
    <div>
      <GreetingCard name="Tunde" message="Have a great day!" color="lightgreen" />
      <GreetingCard name="Amaka" message="Keep up the good work!" color="lightcoral" />
      {/* challenge- default color */}
      <GreetingCard name="Chidi" message="Have a nice weekend!" /> 
    </div>
  );
}

export default App;