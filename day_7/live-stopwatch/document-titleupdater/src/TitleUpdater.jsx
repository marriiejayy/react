import { useState, useEffect } from 'react';
import './TitleUpdater.css';

function TitleUpdater() {
  const [customTitle, setCustomTitle] = useState('');
  const defaultTitle = 'type here...';
  const maxLength = 60;

  useEffect(() => {
    if (customTitle.trim()) {
      document.title = `${defaultTitle} - ${customTitle}`;
    } else {
      document.title = defaultTitle;
    }
  }, [customTitle]);

  useEffect(() => {
    console.log(`Title length: ${customTitle.length}/${maxLength}`);
  }, [customTitle]);

  const resetTitle = () => {
    setCustomTitle('');
    document.title = defaultTitle;
  };

  const remainingChars = maxLength - customTitle.length;
  const isNearLimit = remainingChars <= 10;
  const isAtLimit = remainingChars === 0;

  return (
    <div className="title-updater-container">
      <h2 className="title-updater-header">📝 Document Title Updater</h2>
      
      <div className="input-section">
        <label htmlFor="title-input" className="input-label">
          Custom Title:
        </label>
        <input
          id="title-input"
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Type here..."
          maxLength={maxLength}
          className={`title-input ${isNearLimit ? 'near-limit' : ''} ${isAtLimit ? 'at-limit' : ''}`}
        />
        <div className={`char-counter ${isNearLimit ? 'near-limit' : ''} ${isAtLimit ? 'at-limit' : ''}`}>
          {remainingChars} characters remaining
        </div>
      </div>
      
      <div className="preview-section">
        <strong>Preview:</strong> 
        <span className="preview-text">
          "{customTitle ? `${defaultTitle} - ${customTitle}` : defaultTitle}"
        </span>
      </div>
      
      <button 
        onClick={resetTitle}
        className="reset-btn"
      >
        Reset to Default
      </button>
    </div>
  );
}

export default TitleUpdater;