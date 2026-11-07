import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeUrl, safeJsonParse, sanitizeProfileStrings } from '../security';

describe('Security & Sanitization Utilities', () => {
  describe('sanitizeInput', () => {
    it('strips <script> tags and enclosed malicious code', () => {
      const malicious = 'Hello <script>alert("pwned")</script>World';
      expect(sanitizeInput(malicious)).toBe('Hello World');
    });

    it('strips iframe and style injection attempts', () => {
      const attack = 'Report <iframe src="https://evil.com"></iframe> <style>body{display:none}</style>';
      expect(sanitizeInput(attack)).toBe('Report');
    });

    it('strips inline DOM event handlers like onerror and onload', () => {
      const payload = '<img src=x onerror=alert(1) /> Safe Text';
      const result = sanitizeInput(payload);
      expect(result).not.toContain('onerror');
      expect(result).not.toContain('alert(1)');
    });

    it('neutralizes raw angle brackets into HTML entities', () => {
      const tag = '<b>Bold text</b>';
      const result = sanitizeInput(tag);
      expect(result).toBe('&lt;b&gt;Bold text&lt;/b&gt;');
    });

    it('handles non-string or empty inputs safely', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(42)).toBe('42');
    });
  });

  describe('sanitizeUrl', () => {
    it('allows standard https and http URLs', () => {
      expect(sanitizeUrl('https://scholarships.gov.in')).toBe('https://scholarships.gov.in');
      expect(sanitizeUrl('http://example.edu.in')).toBe('http://example.edu.in');
    });

    it('blocks dangerous javascript: pseudo-protocol', () => {
      expect(sanitizeUrl('javascript:alert(document.cookie)')).toBe('#');
    });

    it('blocks data: and vbscript: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
      expect(sanitizeUrl('vbscript:msgbox("test")')).toBe('#');
    });

    it('auto-prefixes missing protocol with https://', () => {
      expect(sanitizeUrl('scholarships.gov.in')).toBe('https://scholarships.gov.in');
    });

    it('returns custom fallback when given empty or invalid value', () => {
      expect(sanitizeUrl('', '/default')).toBe('/default');
      expect(sanitizeUrl(null, '/default')).toBe('/default');
    });
  });

  describe('safeJsonParse', () => {
    it('parses valid JSON payloads properly', () => {
      const json = JSON.stringify({ name: 'Aarav', cgpa: 8.8 });
      const parsed = safeJsonParse(json, { name: '', cgpa: 0 });
      expect(parsed).toEqual({ name: 'Aarav', cgpa: 8.8 });
    });

    it('recovers gracefully from malformed or corrupted JSON without throwing', () => {
      const corrupted = '{"name": "Ananya", incomplete...';
      const fallback = { name: 'Fallback Student', cgpa: 8.0 };
      const parsed = safeJsonParse(corrupted, fallback);
      expect(parsed).toEqual(fallback);
    });

    it('applies schema validator and returns fallback if validation fails', () => {
      const json = JSON.stringify({ role: 'admin' });
      const fallback = { role: 'student' };
      const parsed = safeJsonParse(
        json,
        fallback,
        (obj) => typeof obj === 'object' && obj !== null && (obj as any).role === 'student'
      );
      expect(parsed).toEqual(fallback);
    });
  });

  describe('sanitizeProfileStrings', () => {
    it('deeply sanitizes string properties in profile objects', () => {
      const profile = {
        fullName: 'Priya <script>alert(1)</script>Sundaram',
        university: 'Anna <img src=x onerror=alert(2)>University',
        marksCgpa: 8.9,
      };

      const cleaned = sanitizeProfileStrings(profile);
      expect(cleaned.fullName).toBe('Priya Sundaram');
      expect(cleaned.university).not.toContain('onerror');
      expect(cleaned.marksCgpa).toBe(8.9);
    });
  });
});
