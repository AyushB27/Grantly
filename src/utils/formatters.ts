/**
 * Formatting and calculation utilities for GRANTLY (Indian Educational Ecosystem)
 * Formats Indian Rupee (INR ₹), CGPA / Percentage, deadlines, and essay metrics
 */

/**
 * Format a number as Indian Rupee (₹) with Indian digit grouping (Lakhs / Crores)
 * e.g. ₹50,000, ₹1,50,000, ₹2,00,000
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format CGPA and show estimated percentage equivalent (CBSE / AICTE formula: CGPA * 9.5)
 */
export function formatCgpa(cgpa: number): string {
  const percentageApprox = (cgpa * 9.5).toFixed(1);
  return `${cgpa.toFixed(2)} CGPA (~${percentageApprox}%)`;
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
      label: 'Portal Closed',
      isUrgent: false,
      colorClass: 'text-neutral-500',
      badgeBg: 'bg-neutral-100 text-neutral-700 border-neutral-300',
      ariaAnnouncement: 'Application deadline has passed',
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining: 0,
      label: 'Closes Today!',
      isUrgent: true,
      colorClass: 'text-rose-700',
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-300',
      ariaAnnouncement: 'Closes today on portal. Urgent.',
    };
  }

  if (daysRemaining <= 7) {
    return {
      daysRemaining,
      label: `${daysRemaining}d left • Urgent`,
      isUrgent: true,
      colorClass: 'text-amber-800',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      ariaAnnouncement: `Portal closing in ${daysRemaining} days. Urgent deadline.`,
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
    label: new Date(deadlineIso).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    isUrgent: false,
    colorClass: 'text-emerald-800',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    ariaAnnouncement: `Due on ${new Date(deadlineIso).toLocaleDateString('en-IN')}`,
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
 * Calculate word count and reading time for Statement of Purpose (SOP) / Essay draft
 */
export function calculateEssayMetrics(text: string): {
  wordCount: number;
  charCount: number;
  estimatedMinutes: number;
} {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedMinutes = Math.ceil(words / 200);
  return { wordCount: words, charCount, estimatedMinutes };
}
