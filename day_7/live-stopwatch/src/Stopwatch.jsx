import { useState, useEffect } from 'react';
import './Stopwatch.css';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  useEffect(() => {
    let intervalId;
    
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  
  const addLap = () => {
    setLaps(prevLaps => [...prevLaps, time]);
  };

  return (
    <div className="stopwatch-container">
      <h2 className="stopwatch-title">⏱️ Stopwatch</h2>
      <div className="time-display">
        {formatTime(time)}
      </div>
      
      <div className="controls">
        <button 
          onClick={start} 
          disabled={isRunning}
          className="btn btn-start"
        >
          Start
        </button>
        <button 
          onClick={pause} 
          disabled={!isRunning}
          className="btn btn-pause"
        >
          Pause
        </button>
        <button onClick={reset} className="btn btn-reset">
          Reset
        </button>
        <button 
          onClick={addLap} 
          disabled={!isRunning}
          className="btn btn-lap"
        >
          Lap
        </button>
      </div>
      
      {laps.length > 0 && (
        <div className="laps-section">
          <h3>Lap Times</h3>
          <div className="laps-list">
            {laps.map((lapTime, index) => (
              <div key={index} className="lap-item">
                <span>Lap {index + 1}</span>
                <span>{formatTime(lapTime)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;