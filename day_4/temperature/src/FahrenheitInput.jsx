function FahrenheitInput({ temperature, onTemperatureChange }) {
  return (
    <div>
      <label>Fahrenheit: </label>
      <input
        type="number"
        value={temperature}
        onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default FahrenheitInput;