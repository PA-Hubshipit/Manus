import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: KeyboardShortcut[];
}

export function useKeyboardShortcuts({ enabled = true, shortcuts }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields (unless it's a global shortcut with ctrl/cmd)
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                         target.tagName === 'TEXTAREA' || 
                         target.isContentEditable;

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      // For shortcuts with modifiers, allow them even in input fields
      const hasModifier = shortcut.ctrl || shortcut.alt || shortcut.meta;
      
      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        // Skip if in input field and no modifier key
        if (isInputField && !hasModifier) continue;
        
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}

// Predefined shortcut keys for consistency
export const SHORTCUT_KEYS = {
  NEW_CHAT: { key: 'n', ctrl: true, description: 'New Chat' },
  SAVE_CHAT: { key: 's', ctrl: true, description: 'Save Chat' },
  SEARCH: { key: 'k', ctrl: true, description: 'Search Conversations' },
  SETTINGS: { key: ',', ctrl: true, description: 'Open Settings' },
  CLOSE: { key: 'Escape', description: 'Close Modal/Panel' },
  FOCUS_INPUT: { key: '/', description: 'Focus Message Input' },
  TOGGLE_SIDEBAR: { key: 'b', ctrl: true, description: 'Toggle Sidebar' },
  CLEAR_CHAT: { key: 'l', ctrl: true, shift: true, description: 'Clear Chat' },
} as const;

// Helper to format shortcut for display
export function formatShortcut(shortcut: { key: string; ctrl?: boolean; shift?: boolean; alt?: boolean }): string {
  const parts: string[] = [];
  
  // Use ⌘ on Mac, Ctrl on others
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  if (shortcut.ctrl) parts.push(isMac ? '⌘' : 'Ctrl');
  if (shortcut.shift) parts.push(isMac ? '⇧' : 'Shift');
  if (shortcut.alt) parts.push(isMac ? '⌥' : 'Alt');
  
  // Format special keys
  let keyDisplay = shortcut.key;
  if (shortcut.key === 'Escape') keyDisplay = 'Esc';
  else if (shortcut.key === ' ') keyDisplay = 'Space';
  else keyDisplay = shortcut.key.toUpperCase();
  
  parts.push(keyDisplay);
  
  return parts.join(isMac ? '' : '+');
}
