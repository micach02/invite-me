import { useCallback, useEffect, useState } from 'react';

const KEY = 'inviteme-theme';
const LIGHT_BAR = '#F8F7F4';
const DARK_BAR = '#131613';

const systemDark = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

/** The saved choice ('light' | 'dark'), or null when the person never picked (then we follow the OS). */
export function storedTheme() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch { return null; }
}

export const resolveTheme = () => storedTheme() ?? (systemDark() ? 'dark' : 'light');

/** Puts the theme on <html> (class for Tailwind/CSS variables, color-scheme for native controls, theme-color for the browser bar). */
export function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? DARK_BAR : LIGHT_BAR);
}

/** `theme` is what's showing now; `toggle()` flips it and remembers the choice on this device. */
export function useTheme() {
  const [theme, setTheme] = useState(resolveTheme);

  useEffect(() => { applyTheme(theme); }, [theme]);

  // Follow the OS while the person hasn't chosen, and stay in sync with other tabs.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onSystem = () => { if (!storedTheme()) setTheme(mq.matches ? 'dark' : 'light'); };
    const onStorage = (e) => { if (e.key === KEY) setTheme(resolveTheme()); };
    mq?.addEventListener?.('change', onSystem);
    window.addEventListener('storage', onStorage);
    window.addEventListener('inviteme-theme', onStorage);
    return () => {
      mq?.removeEventListener?.('change', onSystem);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('inviteme-theme', onStorage);
    };
  }, []);

  const toggle = useCallback(() => {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch { /* private mode: the choice just won't persist */ }
    setTheme(next);
    window.dispatchEvent(new Event('inviteme-theme')); // keeps every mounted toggle in sync
  }, []);

  return { theme, toggle };
}
