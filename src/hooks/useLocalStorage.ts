import { useState, useEffect } from 'react';
import { safeJsonParse } from '../utils/security';

/**
 * Pure reader function for hydrating state from storage with fallback & error handling
 */
export function readStoredValue<T>(
  key: string,
  initialValue: T,
  storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null
): T {
  if (!storage) return initialValue;
  try {
    const item = storage.getItem(key);
    return safeJsonParse<T>(item, initialValue);
  } catch (error) {
    console.warn(`[Storage] Failed reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

/**
 * Pure writer function for persisting serialized state to storage safely
 */
export function writeStoredValue<T>(
  key: string,
  value: T,
  storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null
): void {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[Storage] Failed saving localStorage key "${key}":`, error);
  }
}

/**
 * Robust, secure typed hook for interacting with window.localStorage
 * Gracefully falls back to initial values if parsing fails, schema is corrupted, or in private browsing
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    readStoredValue(key, initialValue)
  );

  useEffect(() => {
    writeStoredValue(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
