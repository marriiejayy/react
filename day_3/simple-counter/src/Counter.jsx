import { useState } from 'react'
import './Counter.css'

function Counter() {
  const [count, setCount] = useState(0);
  
  function increment() {
    setCount(count + 1);
  }
  
  function decrement() {
    // Challenge: Don't allow count to go below 0
    if (count > 0) {
      setCount(count - 1);
    }
  }
  
  function reset() {
    setCount(0);
  }
  
  return (
    <div className="counter">
      <h2>Counter: {count}</h2>
      <div className="button-group">
        <button onClick={increment} className="btn btn-increment">+</button>
        <button onClick={decrement} className="btn btn-decrement">-</button>
        <button onClick={reset} className="btn btn-reset">Reset</button>
      </div>
    </div>
  );
}


export default Counter
