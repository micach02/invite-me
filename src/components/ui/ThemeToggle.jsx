import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme';

/** Light/dark switch. Icon-only by default; pass `label` for a full-width row (e.g. inside a menu). */
export default function ThemeToggle({ className = '', label = false }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  const Icon = dark ? Sun : Moon;
  const text = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return (
    <button
      type="button" onClick={toggle} aria-label={text} title={text} data-theme-toggle
      className={label
        ? `flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-ink-soft hover:bg-canvas hover:text-ink ${className}`
        : `grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft transition hover:bg-ink/[.06] hover:text-ink ${className}`}
    >
      <Icon size={label ? 15 : 18} strokeWidth={1.9} />
      {label && (dark ? 'Light mode' : 'Dark mode')}
    </button>
  );
}
