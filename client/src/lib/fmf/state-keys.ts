/**
 * STATE_KEYS - State Management Registry
 * 
 * Registry of all localStorage keys and important state variables.
 * Before adding new state or localStorage keys, check this registry.
 * 
 * @example
 * ```tsx
 * import { STATE_KEYS, isStateKeyReserved } from '@/lib/fmf';
 * 
 * // Use predefined keys
 * localStorage.setItem(STATE_KEYS.CUSTOM_PRESETS.key, JSON.stringify(presets));
 * 
 * // Check if a key is reserved before using
 * if (isStateKeyReserved('my-presets')) {
 *   console.log('Key conflict! Use a different name.');
 * }
 * ```
 */

export interface StateKeyEntry {
  /** The localStorage key or state variable name */
  key: string;
  /** Brief description of what this state stores */
  description: string;
  /** TypeScript type of the stored value */
  type: string;
  /** Default value if not set */
  defaultValue: string;
  /** Components that read this state */
  readers: string[];
  /** Components that write to this state */
  writers: string[];
  /** Whether this is a localStorage key or React state */
  storage: 'localStorage' | 'state' | 'context';
  /** Whether changing this key would break existing user data */
  breakingChange: boolean;
}

export const STATE_KEYS: Record<string, StateKeyEntry> = {
  // ===========================================================================
  // PRESETS STATE
  // ===========================================================================

  CUSTOM_PRESETS: {
    key: 'multi-ai-chat-custom-presets',
    description: 'User-created custom presets',
    type: 'Preset[]',
    defaultValue: '[]',
    readers: ['PresetsPanel', 'PresetsManagementModal', 'PresetSelectionDialog', 'FloatingChatWindow'],
    writers: ['PresetsManagementModal', 'PresetEditorModal'],
    storage: 'localStorage',
    breakingChange: true,
  },

  QUICK_PRESETS: {
    key: 'multi-ai-chat-quick-presets',
    description: 'Presets shown in the quick presets panel',
    type: 'string[]',
    defaultValue: '[]',
    readers: ['PresetsPanel'],
    writers: ['PresetsPanel', 'PresetSelectionDialog'],
    storage: 'localStorage',
    breakingChange: true,
  },

  PRESET_USAGE: {
    key: 'multi-ai-chat-preset-usage',
    description: 'Usage statistics for presets',
    type: 'Record<string, number>',
    defaultValue: '{}',
    readers: ['PresetsPanel', 'PresetSelectionDialog'],
    writers: ['PresetsPanel'],
    storage: 'localStorage',
    breakingChange: false,
  },

  PRESET_VERSIONS: {
    key: 'multi-ai-chat-preset-versions',
    description: 'Version history for presets',
    type: 'Record<string, PresetVersion[]>',
    defaultValue: '{}',
    readers: ['PresetEditorModal'],
    writers: ['PresetEditorModal'],
    storage: 'localStorage',
    breakingChange: false,
  },

  // ===========================================================================
  // CATEGORIES STATE
  // ===========================================================================

  CUSTOM_CATEGORIES: {
    key: 'multi-ai-chat-custom-categories',
    description: 'User-created custom categories',
    type: 'Category[]',
    defaultValue: '[]',
    readers: ['CategoriesSettingsModal', 'PresetEditorModal', 'PresetSelectionDialog'],
    writers: ['CategoriesSettingsModal'],
    storage: 'localStorage',
    breakingChange: true,
  },

  // ===========================================================================
  // CONVERSATION STATE
  // ===========================================================================

  SAVED_CONVERSATIONS: {
    key: 'multi-ai-chat-saved-conversations',
    description: 'Saved chat conversations',
    type: 'Conversation[]',
    defaultValue: '[]',
    readers: ['FloatingChatWindow', 'SavedConversationsModal', 'ChatFooter'],
    writers: ['FloatingChatWindow'],
    storage: 'localStorage',
    breakingChange: true,
  },

  ARCHIVED_CONVERSATIONS: {
    key: 'multi-ai-chat-archived-conversations',
    description: 'Archived chat conversations',
    type: 'Conversation[]',
    defaultValue: '[]',
    readers: ['SavedConversationsModal', 'ChatFooter'],
    writers: ['SavedConversationsModal'],
    storage: 'localStorage',
    breakingChange: true,
  },

  // ===========================================================================
  // WINDOW STATE
  // ===========================================================================

  WINDOW_POSITIONS: {
    key: 'multi-ai-chat-window-positions',
    description: 'Saved positions and sizes of floating windows',
    type: 'Record<string, WindowPosition>',
    defaultValue: '{}',
    readers: ['FloatingChatWindow'],
    writers: ['FloatingChatWindow'],
    storage: 'localStorage',
    breakingChange: false,
  },

  WINDOW_LAYOUTS: {
    key: 'multi-ai-chat-window-layouts',
    description: 'Saved window layout presets',
    type: 'WindowLayout[]',
    defaultValue: '[]',
    readers: ['WindowLayoutPresets', 'EmptyPage'],
    writers: ['WindowLayoutPresets'],
    storage: 'localStorage',
    breakingChange: true,
  },

  MINIMIZED_WINDOWS: {
    key: 'multi-ai-chat-minimized-windows',
    description: 'IDs of currently minimized windows',
    type: 'string[]',
    defaultValue: '[]',
    readers: ['WindowDock', 'EmptyPage'],
    writers: ['FloatingChatWindow', 'WindowDock'],
    storage: 'state',
    breakingChange: false,
  },

  // ===========================================================================
  // THEME STATE
  // ===========================================================================

  THEME: {
    key: 'vite-ui-theme',
    description: 'Current theme (light/dark)',
    type: '"light" | "dark" | "system"',
    defaultValue: '"dark"',
    readers: ['ThemeProvider', 'EmptyPage', 'AgentsPage', 'ConversationPage'],
    writers: ['ThemeProvider'],
    storage: 'localStorage',
    breakingChange: false,
  },

  // ===========================================================================
  // MODEL STATE
  // ===========================================================================

  DEFAULT_MODELS: {
    key: 'multi-ai-chat-default-models',
    description: 'Default models to select when opening new chat',
    type: 'string[]',
    defaultValue: '[]',
    readers: ['FloatingChatWindow', 'PresetsManagementModal'],
    writers: ['PresetsManagementModal'],
    storage: 'localStorage',
    breakingChange: false,
  },

  SELECTED_MODELS: {
    key: 'multi-ai-chat-selected-models',
    description: 'Currently selected models in active chat',
    type: 'string[]',
    defaultValue: '[]',
    readers: ['FloatingChatWindow', 'ChatFooter', 'ModelSelector'],
    writers: ['FloatingChatWindow', 'ModelSelector', 'PresetsPanel'],
    storage: 'state',
    breakingChange: false,
  },

  // ===========================================================================
  // CONNECTOR STATE
  // ===========================================================================

  ENABLED_CONNECTORS: {
    key: 'multi-ai-chat-enabled-connectors',
    description: 'IDs of enabled external connectors',
    type: 'string[]',
    defaultValue: '[]',
    readers: ['ConnectorsStore', 'FloatingChatWindow'],
    writers: ['ConnectorsStore'],
    storage: 'localStorage',
    breakingChange: false,
  },

  // ===========================================================================
  // ANALYTICS STATE
  // ===========================================================================

  ANALYTICS_DATA: {
    key: 'multi-ai-chat-analytics',
    description: 'Chat analytics and statistics',
    type: 'AnalyticsData',
    defaultValue: '{}',
    readers: ['AnalyticsPanel'],
    writers: ['FloatingChatWindow'],
    storage: 'localStorage',
    breakingChange: false,
  },
};

/**
 * Check if a localStorage key is reserved
 * @param key The key to check
 * @returns true if the key is reserved
 */
export function isStateKeyReserved(key: string): boolean {
  return Object.values(STATE_KEYS).some(sk => sk.key === key);
}

/**
 * Get state key entry by key name
 * @param key The key to look up
 * @returns The state key entry or undefined
 */
export function getStateKey(key: string): StateKeyEntry | undefined {
  return Object.values(STATE_KEYS).find(sk => sk.key === key);
}

/**
 * Get all localStorage keys
 * @returns Array of localStorage key strings
 */
export function getAllLocalStorageKeys(): string[] {
  return Object.values(STATE_KEYS)
    .filter(sk => sk.storage === 'localStorage')
    .map(sk => sk.key);
}

/**
 * Get all state keys that a component reads
 * @param componentName The component name
 * @returns Array of state key entries
 */
export function getStateKeysReadBy(componentName: string): StateKeyEntry[] {
  return Object.values(STATE_KEYS).filter(sk => sk.readers.includes(componentName));
}

/**
 * Get all state keys that a component writes
 * @param componentName The component name
 * @returns Array of state key entries
 */
export function getStateKeysWrittenBy(componentName: string): StateKeyEntry[] {
  return Object.values(STATE_KEYS).filter(sk => sk.writers.includes(componentName));
}

/**
 * Get the default value for a state key
 * @param keyName The state key name (e.g., 'CUSTOM_PRESETS')
 * @returns The parsed default value
 */
export function getDefaultValue<T>(keyName: keyof typeof STATE_KEYS): T {
  const entry = STATE_KEYS[keyName];
  if (!entry) {
    throw new Error(`[FMF] State key not found: ${keyName}`);
  }
  return JSON.parse(entry.defaultValue);
}

/**
 * Safely get a value from localStorage with type checking
 * @param keyName The state key name
 * @returns The stored value or default
 */
export function getStoredValue<T>(keyName: keyof typeof STATE_KEYS): T {
  const entry = STATE_KEYS[keyName];
  if (!entry || entry.storage !== 'localStorage') {
    throw new Error(`[FMF] Invalid localStorage key: ${keyName}`);
  }
  
  try {
    const stored = localStorage.getItem(entry.key);
    if (stored === null) {
      return JSON.parse(entry.defaultValue);
    }
    return JSON.parse(stored);
  } catch {
    console.warn(`[FMF] Failed to parse localStorage key: ${entry.key}`);
    return JSON.parse(entry.defaultValue);
  }
}

/**
 * Safely set a value in localStorage
 * @param keyName The state key name
 * @param value The value to store
 */
export function setStoredValue<T>(keyName: keyof typeof STATE_KEYS, value: T): void {
  const entry = STATE_KEYS[keyName];
  if (!entry || entry.storage !== 'localStorage') {
    throw new Error(`[FMF] Invalid localStorage key: ${keyName}`);
  }
  
  try {
    localStorage.setItem(entry.key, JSON.stringify(value));
  } catch (error) {
    console.error(`[FMF] Failed to save to localStorage: ${entry.key}`, error);
  }
}

/**
 * PREFIX for all localStorage keys in this app
 * Use this when creating new keys to maintain consistency
 */
export const STORAGE_PREFIX = 'multi-ai-chat-' as const;
