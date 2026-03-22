const STORAGE_KEY = 'writer-factory-theme';

export type Theme = 'light' | 'dark';

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEY, theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function initTheme(): void {
  const theme = getTheme();
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
