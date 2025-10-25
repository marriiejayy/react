function CelsiusInput({ temperature, onTemperatureChange }) {
  return (
    <div>
      <label>Celsius: </label>
      <input
        type="number"
        value={temperature}
        onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default CelsiusInput;