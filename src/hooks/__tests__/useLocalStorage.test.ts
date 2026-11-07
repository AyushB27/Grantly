import { describe, it, expect, beforeEach } from 'vitest';
import { readStoredValue, writeStoredValue } from '../useLocalStorage';

describe('useLocalStorage Storage Primitives', () => {
  let mockStore: Record<string, string>;
  let mockStorage: Storage;

  beforeEach(() => {
    mockStore = {};
    mockStorage = {
      getItem: (key: string) => mockStore[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStore[key];
      },
      clear: () => {
        mockStore = {};
      },
      key: (index: number) => Object.keys(mockStore)[index] ?? null,
      length: Object.keys(mockStore).length,
    };
  });

  describe('readStoredValue (Hydration & Recovery)', () => {
    it('hydrates properly when valid JSON exists in storage', () => {
      mockStorage.setItem('grantly_test_key', JSON.stringify({ name: 'Aarav Sharma', cgpa: 8.5 }));
      const result = readStoredValue('grantly_test_key', { name: '', cgpa: 0 }, mockStorage);

      expect(result).toEqual({ name: 'Aarav Sharma', cgpa: 8.5 });
    });

    it('returns default initialValue when key does not exist in storage', () => {
      const result = readStoredValue('non_existent_key', 'default_theme', mockStorage);
      expect(result).toBe('default_theme');
    });

    it('recovers gracefully from corrupted or malformed JSON without crashing', () => {
      mockStorage.setItem('corrupted_key', '{badJson: true, broken:');
      const fallback = { fallback: true };
      const result = readStoredValue('corrupted_key', fallback, mockStorage);

      expect(result).toEqual(fallback);
    });

    it('safely handles missing or null storage (SSR environments)', () => {
      const result = readStoredValue('any_key', 'initial_val', null);
      expect(result).toBe('initial_val');
    });
  });

  describe('writeStoredValue (Serialization & Persistence)', () => {
    it('correctly serializes and persists complex objects into storage', () => {
      const payload = {
        id: 'ind-01',
        title: 'Reliance Foundation Scholarship',
        amount: 200000,
        tags: ['STEM', 'EWS'],
      };

      writeStoredValue('grantly_grant_key', payload, mockStorage);
      const rawStored = mockStorage.getItem('grantly_grant_key');

      expect(rawStored).toBeDefined();
      expect(JSON.parse(rawStored!)).toEqual(payload);
    });

    it('correctly serializes primitive values like strings, booleans, and numbers', () => {
      writeStoredValue('theme', 'dark', mockStorage);
      expect(JSON.parse(mockStorage.getItem('theme')!)).toBe('dark');

      writeStoredValue('count', 42, mockStorage);
      expect(JSON.parse(mockStorage.getItem('count')!)).toBe(42);

      writeStoredValue('isComplete', true, mockStorage);
      expect(JSON.parse(mockStorage.getItem('isComplete')!)).toBe(true);
    });

    it('does not throw when storage is null or unavailable', () => {
      expect(() => {
        writeStoredValue('key', { data: 'test' }, null);
      }).not.toThrow();
    });
  });
});
