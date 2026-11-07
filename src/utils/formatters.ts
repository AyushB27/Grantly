/**
 * Formatting and calculation utilities for GRANTLY
 * High contrast, deterministic helpers for currency, deadlines, and percentages
 */

/**
 * Format a number as USD currency without decimals
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate days remaining until a deadline and return urgency metadata
 */
export function getDeadlineUrgency(deadlineIso: string): {
  daysRemaining: number;
  label: string;
  isUrgent: boolean;
  colorClass: string;
  badgeBg: string;
  ariaAnnouncement: string;
} {
  const target = new Date(deadlineIso);
  const now = new Date('2026-11-07'); // Reference hackathon current date
  const diffTime = target.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    return {
      daysRemaining,
      label: 'Deadline Passed',
      isUrgent: false,
      colorClass: 'text-neutral-500',
      badgeBg: 'bg-neutral-100 text-neutral-700 border-neutral-300',
      ariaAnnouncement: 'Deadline has passed',
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining: 0,
      label: 'Due Today',
      isUrgent: true,
      colorClass: 'text-rose-700',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
      ariaAnnouncement: 'Due today. High urgency.',
    };
  }

  if (daysRemaining <= 7) {
    return {
      daysRemaining,
      label: `${daysRemaining}d left • Urgent`,
      isUrgent: true,
      colorClass: 'text-amber-800',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      ariaAnnouncement: `Due in ${daysRemaining} days. Urgent deadline.`,
    };
  }

  if (daysRemaining <= 30) {
    return {
      daysRemaining,
      label: `${daysRemaining} days left`,
      isUrgent: false,
      colorClass: 'text-blue-800',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      ariaAnnouncement: `Due in ${daysRemaining} days.`,
    };
  }

  return {
    daysRemaining,
    label: new Date(deadlineIso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    isUrgent: false,
    colorClass: 'text-emerald-800',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    ariaAnnouncement: `Due on ${new Date(deadlineIso).toLocaleDateString()}`,
  };
}

/**
 * Truncate text cleanly with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Calculate word count and reading time for essay draft
 */
export function calculateEssayMetrics(text: string): {
  wordCount: number;
  charCount: number;
  estimatedMinutes: number;
} {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedMinutes = Math.ceil(words / 200); // 200 wpm avg reading/writing speed
  return { wordCount: words, charCount, estimatedMinutes };
}
