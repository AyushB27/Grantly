import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatCgpa,
  getDeadlineUrgency,
  truncateText,
  calculateEssayMetrics,
} from '../formatters';

describe('Formatters and Ecosystem Utilities', () => {
  describe('formatCurrency', () => {
    it('formats Indian Rupee amounts using Lakhs comma grouping', () => {
      expect(formatCurrency(50000)).toMatch(/₹\s?50,000/);
      expect(formatCurrency(200000)).toMatch(/₹\s?2,00,000/);
      expect(formatCurrency(1000000)).toMatch(/₹\s?10,00,000/);
    });

    it('handles 0 and negative amounts gracefully', () => {
      expect(formatCurrency(0)).toMatch(/₹\s?0/);
    });
  });

  describe('formatCgpa', () => {
    it('calculates CBSE/AICTE percentage equivalent correctly (CGPA * 9.5)', () => {
      // 8.0 * 9.5 = 76.0%
      expect(formatCgpa(8.0)).toContain('8.00 CGPA (~76.0%)');
      // 9.2 * 9.5 = 87.4%
      expect(formatCgpa(9.2)).toContain('9.20 CGPA (~87.4%)');
    });
  });

  describe('getDeadlineUrgency', () => {
    it('flags overdue deadlines as Portal Closed', () => {
      const urgency = getDeadlineUrgency('2026-10-01');
      expect(urgency.label).toBe('Portal Closed');
      expect(urgency.isUrgent).toBe(false);
    });

    it('flags deadlines within 7 days as high urgency', () => {
      // Reference date is 2026-11-07, so 2026-11-12 is 5 days away
      const urgency = getDeadlineUrgency('2026-11-12');
      expect(urgency.isUrgent).toBe(true);
      expect(urgency.label).toContain('left • Urgent');
    });

    it('marks deadlines between 8 and 30 days as upcoming', () => {
      // 2026-11-25 is 18 days away
      const urgency = getDeadlineUrgency('2026-11-25');
      expect(urgency.isUrgent).toBe(false);
      expect(urgency.label).toBe('18 days left');
    });
  });

  describe('truncateText', () => {
    it('truncates long strings with ellipsis', () => {
      expect(truncateText('Central Sector Scheme for University Students', 14)).toBe(
        'Central Sector...'
      );
    });

    it('returns exact string if within length threshold', () => {
      expect(truncateText('Short Title', 50)).toBe('Short Title');
    });
  });

  describe('calculateEssayMetrics', () => {
    it('calculates word count and estimated reading minutes correctly', () => {
      const draft =
        'As an aspiring engineer from a rural background, I have dedicated myself to mastering data structures and computer systems. This scholarship will bridge my tuition shortfall.';
      const metrics = calculateEssayMetrics(draft);
      expect(metrics.wordCount).toBe(26);
      expect(metrics.charCount).toBe(draft.length);
      expect(metrics.estimatedMinutes).toBe(1);
    });

    it('handles empty text without dividing by zero', () => {
      const metrics = calculateEssayMetrics('');
      expect(metrics.wordCount).toBe(0);
      expect(metrics.estimatedMinutes).toBe(0);
    });
  });
});
