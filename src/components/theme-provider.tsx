'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [darkMode]);

  return <>{children}</>;
}
