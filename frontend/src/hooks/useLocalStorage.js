import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = (val) => {
    try {
      setValue(val);
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.error('Storage error:', err);
    }
  };

  return [value, setStoredValue];
};
export default useLocalStorage;
