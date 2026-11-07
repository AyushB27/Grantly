import { useState, useEffect } from 'react';
import { safeJsonParse } from '../utils/security';

/**
 * Robust, secure typed hook for interacting with window.localStorage
 * Gracefully falls back to initial values if parsing fails, schema is corrupted, or in private browsing
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return safeJsonParse<T>(item, initialValue);
    } catch (error) {
      console.warn(`[Storage] Failed reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`[Storage] Failed saving localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
