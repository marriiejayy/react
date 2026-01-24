// src/components/AccessibilityManager.jsx
import React, { useEffect } from 'react';
import { FaAccessibleIcon, FaTextHeight, FaContrast } from 'react-icons/fa';

const AccessibilityManager = () => {
  const [settings, setSettings] = React.useState({
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
  });

  useEffect(() => {
    // Load accessibility settings
    const saved = localStorage.getItem('accessibility_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applyAccessibilitySettings(parsed);
    }
  }, []);

  const applyAccessibilitySettings = (newSettings) => {
    const root = document.documentElement;
    
    // Font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px',
    };
    root.style.fontSize = fontSizeMap[newSettings.fontSize];
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--transition-duration');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <FaAccessibleIcon /> Accessibility
        </h4>
        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-2 text-sm">
              <FaTextHeight /> Font Size
              <select
                value={settings.fontSize}
                onChange={(e) => {
                  const newSettings = { ...settings, fontSize: e.target.value };
                  setSettings(newSettings);
                  applyAccessibilitySettings(newSettings);
                }}
                className="ml-2 px-2 py-1 border rounded text-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xlarge">Extra Large</option>
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="highContrast"
              checked={settings.highContrast}
              onChange={(e) => {
                const newSettings = { ...settings, highContrast: e.target.checked };
                setSettings(newSettings);
                applyAccessibilitySettings(newSettings);
              }}
              className="rounded"
            />
            <label htmlFor="highContrast" className="flex items-center gap-2 text-sm">
              <FaContrast /> High Contrast
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};