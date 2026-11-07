import React from 'react';
import type { CategoryTag } from '../../types/scholarship';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'mint' | 'amber' | 'rose' | 'blue' | 'purple' | 'neutral';
  category?: CategoryTag;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  category,
  className = '',
}) => {
  let styles = 'bg-[#1a201f] text-[#89918c] border-[#222827]';

  if (category) {
    switch (category) {
      case 'STEM':
        styles = 'bg-[#70b4ff14] text-[#70b4ff] border-[#70b4ff33]';
        break;
      case 'Women in Tech':
        styles = 'bg-[#c084fc14] text-[#c084fc] border-[#c084fc33]';
        break;
      case 'Need-Based (EWS)':
        styles = 'bg-[#a9f46b14] text-[#a9f46b] border-[#a9f46b33]';
        break;
      case 'Merit-Based':
        styles = 'bg-[#f7ba5314] text-[#f7ba53] border-[#f7ba5333]';
        break;
      case 'First-Generation Learner':
        styles = 'bg-[#2dd4bf14] text-[#2dd4bf] border-[#2dd4bf33]';
        break;
      case 'SC / ST / OBC':
        styles = 'bg-[#818cf814] text-[#818cf8] border-[#818cf833]';
        break;
      case 'Healthcare & Medical':
        styles = 'bg-[#fb718514] text-[#fb7185] border-[#fb718533]';
        break;
      case 'Single Girl Child':
        styles = 'bg-[#f472b614] text-[#f472b6] border-[#f472b633]';
        break;
      default:
        styles = 'bg-[#1a201f] text-[#89918c] border-[#222827]';
    }
  } else {
    switch (variant) {
      case 'mint':
        styles = 'bg-[#a9f46b14] text-[#a9f46b] border-[#a9f46b33]';
        break;
      case 'amber':
        styles = 'bg-[#f7ba5314] text-[#f7ba53] border-[#f7ba5333]';
        break;
      case 'rose':
        styles = 'bg-[#ff8e9114] text-[#ff8e91] border-[#ff8e9133]';
        break;
      case 'blue':
        styles = 'bg-[#70b4ff14] text-[#70b4ff] border-[#70b4ff33]';
        break;
      case 'purple':
        styles = 'bg-[#c084fc14] text-[#c084fc] border-[#c084fc33]';
        break;
      case 'neutral':
      default:
        styles = 'bg-[#161c1b] text-[#89918c] border-[#222827]';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${styles} ${className}`}
    >
      {children}
    </span>
  );
};
