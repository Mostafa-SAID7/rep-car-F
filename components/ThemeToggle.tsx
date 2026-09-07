import React from 'react';
import { cx } from '../styles';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={cx(
      'group flex h-11 min-w-11 items-center gap-2 rounded-full border border-border bg-card p-1 shadow-sm transition-colors duration-300 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:min-w-[5.5rem] sm:pr-3',
      isDark && 'bg-secondary',
    )}
    aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    aria-pressed={isDark}
    title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
  >
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
    >
      <svg
        className={cx('h-4 w-4 transition duration-500', isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
      <svg
        className={cx('absolute h-4 w-4 transition duration-500', isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100')}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </span>
    <span className="hidden text-xs font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-primary sm:block" aria-hidden="true">
      {isDark ? 'Dark' : 'Light'}
    </span>
  </button>
);

export default ThemeToggle;