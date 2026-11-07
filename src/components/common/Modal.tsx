import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  eyebrow,
  children,
  maxWidth = '2xl',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const titleId = `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`;

  // Keyboard Escape listener, Focus Trap, and Return Focus
  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus when closed
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Close on Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // 2. Active Tab Focus Trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, cycle to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab: if on last element, cycle to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on first focusable element or modal container
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector<HTMLElement>(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalRef.current.focus();
        }
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);

      // Restore focus to original triggering element
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${maxWidthClasses} bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--border-card)] overflow-hidden transform transition-all my-6 max-h-[92vh] flex flex-col focus:outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-card)] bg-[var(--bg-card-subtle)]">
          <div className="min-w-0 pr-4">
            {eyebrow && (
              <span className="eyebrow text-emerald-600 dark:text-emerald-400 block mb-0.5 truncate">
                {eyebrow}
              </span>
            )}
            <h2 id={titleId} className="text-lg sm:text-xl font-bold text-[var(--text-primary)] tracking-tight truncate">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="p-6 overflow-y-auto space-y-4 text-[var(--text-primary)]">
          {children}
        </div>
      </div>
    </div>
  );
};
