import { useState } from 'react';
import CelsiusInput from './CelsiusInput';
import FahrenheitInput from './FahrenheitInput';

function TemperatureApp() {
  const [temperature, setTemperature] = useState(0);

  function handleCelsiusChange(newCelsius) {
    setTemperature(newCelsius);
  }

  function handleFahrenheitChange(newFahrenheit) {
    setTemperature((newFahrenheit - 32) * 5 / 9);
  }

  const fahrenheit = (temperature * 9 / 5) + 32;

  return (
    <div>
      <h1>Temperature Converter</h1>
      <CelsiusInput temperature={temperature} onTemperatureChange={handleCelsiusChange} />
      <FahrenheitInput temperature={fahrenheit} onTemperatureChange={handleFahrenheitChange} />
    </div>
  );
}

export default TemperatureApp;