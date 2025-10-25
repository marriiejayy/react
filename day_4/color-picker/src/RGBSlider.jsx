function RGBSlider({ color, value, onChange }) {
  return (
    <div>
      <label>{color}: </label>
      <input 
        type="range" 
        min="0" 
        max="255" 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      />
      <span> {value}</span>
    </div>
  );
}

export default RGBSlider;