// src/utils/performance.js
import { useEffect, useRef, useCallback } from 'react';

// Debounce hook
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

// Virtual scroll for large document lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight)
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const onScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return { containerRef, visibleItems, startIndex, onScroll };
};

// Optimized selectors with Reselect
import { createSelector } from '@reduxjs/toolkit';

export const selectDocumentsWithStats = createSelector(
  [(state) => state.document.documents],
  (documents) => {
    const processed = documents.filter(d => d.status === 'processed').length;
    const totalSize = documents.reduce((sum, doc) => {
      const size = parseFloat(doc.size) || 0;
      return sum + size;
    }, 0);
    
    return documents.map(doc => ({
      ...doc,
      processed: doc.status === 'processed',
      sizeInMB: parseFloat(doc.size) || 0,
    }));
  }
);