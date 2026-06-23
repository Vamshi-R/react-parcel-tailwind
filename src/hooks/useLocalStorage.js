import { useEffect, useState } from 'react';

/**
 * Persist a piece of state to localStorage and keep it in sync.
 * @param {string} key - The localStorage key.
 * @param {*} initialValue - The initial value if nothing is stored yet.
 * @returns {[any, Function]} A stateful value and a setter, like useState.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. storage unavailable / quota exceeded).
    }
  }, [key, value]);

  return [value, setValue];
}
