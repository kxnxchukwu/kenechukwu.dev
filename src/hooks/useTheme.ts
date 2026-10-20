import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const THEME_COLORS: Record<Theme, string> = {
  light: '#ffffff',
  dark: '#0a0a0a'
};

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function darkQuery() {
  return window.matchMedia?.('(prefers-color-scheme: dark)');
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => readStoredTheme() ?? (darkQuery()?.matches ? 'dark' : 'light')
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[theme]);
  }, [theme]);

  // Follow the system setting until the visitor picks a theme themselves
  useEffect(() => {
    const query = darkQuery();
    if (!query) return;
    const onChange = (event: MediaQueryListEvent) => {
      if (!readStoredTheme()) setTheme(event.matches ? 'dark' : 'light');
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked; the choice then lasts for this visit only
    }
    setTheme(next);
  };

  return { theme, toggleTheme };
}
