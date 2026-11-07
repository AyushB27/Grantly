import React from 'react';
import type { CategoryTag } from '../../types/scholarship';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'category';
  category?: CategoryTag;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  category,
  className = '',
}) => {
  // Accessible, high-contrast color pairings conforming to WCAG AA 4.5:1
  let variantStyles = 'bg-slate-100 text-slate-800 border-slate-300';

  if (category) {
    switch (category) {
      case 'STEM':
        variantStyles = 'bg-blue-50 text-blue-800 border-blue-200';
        break;
      case 'Women in Tech':
        variantStyles = 'bg-purple-50 text-purple-800 border-purple-200';
        break;
      case 'Need-Based':
        variantStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        break;
      case 'Merit':
        variantStyles = 'bg-amber-50 text-amber-900 border-amber-200';
        break;
      case 'First-Generation':
        variantStyles = 'bg-teal-50 text-teal-800 border-teal-200';
        break;
      case 'Minority':
        variantStyles = 'bg-indigo-50 text-indigo-800 border-indigo-200';
        break;
      case 'Healthcare':
        variantStyles = 'bg-rose-50 text-rose-800 border-rose-200';
        break;
      case 'Community Service':
        variantStyles = 'bg-sky-50 text-sky-800 border-sky-200';
        break;
      default:
        variantStyles = 'bg-slate-100 text-slate-800 border-slate-300';
    }
  } else {
    switch (variant) {
      case 'primary':
        variantStyles = 'bg-indigo-50 text-indigo-800 border-indigo-200';
        break;
      case 'success':
        variantStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        break;
      case 'warning':
        variantStyles = 'bg-amber-50 text-amber-800 border-amber-300';
        break;
      case 'danger':
        variantStyles = 'bg-rose-50 text-rose-800 border-rose-300';
        break;
      case 'secondary':
        variantStyles = 'bg-purple-50 text-purple-800 border-purple-200';
        break;
      case 'neutral':
      default:
        variantStyles = 'bg-slate-100 text-slate-700 border-slate-300';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border transition-colors ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
