import { useState, useRef, useEffect } from 'react';
import './TypingSpeedTest.css';

function TypingSpeedTest() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [userInput, setUserInput] = useState('');
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const sampleText = "Lagos is the largest city in Nigeria and one of the fastest-growing cities in the world. It serves as the economic hub of the country.";
  
  // Focus input when started becomes true
  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [started]);
  
  function startTest() {
    setStarted(true);
    setFinished(false);
    setUserInput('');
    setTimeElapsed(0);
    startTimeRef.current = Date.now();
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }
  
  function handleInputChange(e) {
    const value = e.target.value;
    setUserInput(value);
    
    // Check if user completed typing
    if (value === sampleText) {
      finishTest();
    }
  }
  
  function finishTest() {
    setFinished(true);
    setStarted(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  
  function resetTest() {
    setStarted(false);
    setFinished(false);
    setUserInput('');
    setTimeElapsed(0);
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
  
  // Calculate statistics
  const wordsTyped = userInput.trim().split(/\s+/).filter(word => word.length > 0).length;
  const accuracy = userInput.length > 0
    ? Math.round((userInput.split('').filter((char, i) => char === sampleText[i]).length / sampleText.length) * 100)
    : 0;
  const wpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
  
  return (
    <div className="typing-container">
      <h1>⌨️ Typing Speed Test</h1>
      <p className="subtitle">Test your typing speed with Nigerian context!</p>
      
      {!started && !finished && (
        <div className="start-section">
          <div className="sample-text">
            <h3>Type this text:</h3>
            <p>{sampleText}</p>
          </div>
          <button onClick={startTest} className="start-btn">
            Start Test
          </button>
        </div>
      )}
      
      {started && (
        <div className="test-section">
          <div className="timer">
            Time: {timeElapsed}s
          </div>
          
          <div className="sample-display">
            <h3>Type this:</h3>
            <p className="sample-text-display">{sampleText}</p>
          </div>
          
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            className="typing-input"
            placeholder="Start typing here..."
            rows="5"
          />
          
          <div className="stats">
            <div className="stat">
              <span className="stat-label">Words:</span>
              <span className="stat-value">{wordsTyped}</span>
            </div>
            <div className="stat">
              <span className="stat-label">WPM:</span>
              <span className="stat-value">{wpm}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Accuracy:</span>
              <span className="stat-value">{accuracy}%</span>
            </div>
          </div>
          
          <button onClick={resetTest} className="reset-btn">
            Reset
          </button>
        </div>
      )}
      
      {finished && (
        <div className="results-section">
          <h2>🎉 Test Complete!</h2>
          
          <div className="results">
            <div className="result-item">
              <span className="result-label">Time Taken:</span>
              <span className="result-value">{timeElapsed} seconds</span>
            </div>
            <div className="result-item">
              <span className="result-label">Words Per Minute:</span>
              <span className="result-value">{wpm} WPM</span>
            </div>
            <div className="result-item">
              <span className="result-label">Accuracy:</span>
              <span className="result-value">{accuracy}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Words:</span>
              <span className="result-value">{wordsTyped}</span>
            </div>
          </div>
          
          <div className="performance">
            {wpm >= 60 && <p className="excellent">Excellent! 🏆</p>}
            {wpm >= 40 && wpm < 60 && <p className="good">Good Job! 👍</p>}
            {wpm < 40 && <p className="practice">Keep Practicing! 📚</p>}
          </div>
          
          <button onClick={resetTest} className="try-again-btn">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default TypingSpeedTest;