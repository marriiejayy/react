import { useState } from 'react';

function TodoInput({ onAdd }) {
  const [inputValue, setInputValue] = useState('');

  function handleSubmit() {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className='input-div'>
      <input className='list-input' 
        type="text"
        placeholder="Add new list..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className='add-btn' onClick={handleSubmit}>Add</button>
    </div>
  );
}

export default TodoInput;