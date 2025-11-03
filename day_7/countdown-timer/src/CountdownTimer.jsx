import { useState, useEffect } from 'react';
import './CountdownTimer.css';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({});
  const [targetDate, setTargetDate] = useState('');
  const [customDate, setCustomDate] = useState('');
  
  // Default target: Nigerian Independence Day (October 1st)
  const defaultTargetDate = new Date(new Date().getFullYear(), 9, 1);
  
  // If default target is in the past, set to next year
  if (defaultTargetDate < new Date()) {
    defaultTargetDate.setFullYear(defaultTargetDate.getFullYear() + 1);
  }

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = targetDate ? new Date(targetDate) : defaultTargetDate;
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          hasPassed: false
        });
      } else {
        setTimeLeft({ hasPassed: true });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleCustomDate = (e) => {
    setCustomDate(e.target.value);
  };

  const setCustomTarget = () => {
    if (customDate) {
      setTargetDate(customDate);
    }
  };

  const resetToDefault = () => {
    setTargetDate('');
    setCustomDate('');
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const displayDate = targetDate ? new Date(targetDate) : defaultTargetDate;

  return (
    <div className="countdown-container">
      <h2 className="countdown-title">🎉 Countdown Timer</h2>
      
      <div className="event-info">
        <h3 className="event-name">
          {targetDate ? 'Countdown to Your Event' : 'Countdown to Independence Day'}
        </h3>
        <p className="event-date">
          {formatDate(displayDate)}
        </p>
      </div>

      {timeLeft.hasPassed ? (
        <div className="event-started">
          🎊 Event Started! 🎊
        </div>
      ) : (
        <div className="countdown-display">
          <div className="time-units">
            {timeLeft.days !== undefined && (
              <>
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Minutes" />
                <TimeUnit value={timeLeft.seconds} label="Seconds" />
              </>
            )}
          </div>
        </div>
      )}

      <div className="custom-date-section">
        <h3>Set Custom Countdown</h3>
        <div className="custom-date-controls">
          <input
            type="datetime-local"
            value={customDate}
            onChange={handleCustomDate}
            className="date-input"
          />
          <div className="custom-date-buttons">
            <button onClick={setCustomTarget} className="btn btn-set">
              Set Custom Date
            </button>
            <button onClick={resetToDefault} className="btn btn-reset">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }) {
  return (
    <div className="time-unit">
      <div className="time-value">
        {value?.toString().padStart(2, '0')}
      </div>
      <div className="time-label">{label}</div>
    </div>
  );
}

export default CountdownTimer;