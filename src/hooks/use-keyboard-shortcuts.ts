'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';

export function useKeyboardShortcuts() {
  const { toggleDarkMode, setViewMode, toggleSidebar } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl/Cmd + K - Command palette (to be implemented)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Will be connected to command palette
        console.log('Command palette');
      }

      // N - New task
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Will be connected to task modal
        console.log('New task');
      }

      // / - Focus search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
          (searchInput as HTMLInputElement).focus();
        }
      }

      // D - Toggle dark mode
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleDarkMode();
      }

      // B - Toggle sidebar
      if (e.key === 'b' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        toggleSidebar();
      }

      // 1 - Kanban view
      if (e.key === '1' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setViewMode('kanban');
      }

      // 2 - List view
      if (e.key === '2' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setViewMode('list');
      }

      // 3 - Calendar view
      if (e.key === '3' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setViewMode('calendar');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDarkMode, setViewMode, toggleSidebar]);
}
