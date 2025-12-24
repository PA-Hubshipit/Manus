/**
 * UI_LABELS - All User-Facing Text Constants
 * 
 * MANDATORY USAGE:
 * - Import: import { UI_LABELS } from '@/lib/fmf';
 * - Use: <span>{UI_LABELS.HEADER.THEME}</span>
 * 
 * FORBIDDEN:
 * - Hardcoded strings: <span>Theme</span>
 * - Template literals with hardcoded text: `Switch to ${mode} mode`
 * 
 * @example
 * ```tsx
 * import { UI_LABELS } from '@/lib/fmf';
 * 
 * // Correct usage
 * <button>{UI_LABELS.HEADER.MODE}</button>
 * <span>{UI_LABELS.SETTINGS.CHAT_THEME}</span>
 * 
 * // WRONG - hardcoded string
 * <button>Mode</button>
 * ```
 */

export const UI_LABELS = {
  // ===========================================================================
  // HEADER - Labels appearing in the main header area
  // ===========================================================================
  HEADER: {
    /**
     * MODE
     * Location: Header, top-right corner
     * Component: ModeMenu.tsx
     * Purpose: Navigation dropdown for switching between app modes
     * Values shown: Chat, Empty, Conversation, Agents
     * 
     * WARNING: "Mode" is RESERVED for navigation only.
     * DO NOT use "Mode" for theme switching or any other purpose.
     */
    MODE: 'Mode' as const,

    /**
     * THEME
     * Location: Hamburger menu (sidebar), before WINDOWS section
     * Component: EmptyPage.tsx, AgentsPage.tsx, ConversationPage.tsx
     * Purpose: Toggle between dark and light appearance
     * Behavior: Shows sun icon (dark mode) or moon icon (light mode)
     * 
     * NOTE: This is GLOBAL theme. For chat-specific styling, see SETTINGS.CHAT_THEME
     */
    THEME: 'Theme' as const,

    /**
     * NEW_CHAT
     * Location: Header hamburger menu
     * Component: EmptyPage.tsx
     * Purpose: Start a new chat conversation
     */
    NEW_CHAT: 'New Chat' as const,

    /**
     * WINDOWS
     * Location: Header hamburger menu section title
     * Component: EmptyPage.tsx
     * Purpose: Section header for window layout options
     */
    WINDOWS: 'Windows' as const,

    /**
     * SAVE_LAYOUT
     * Location: Header hamburger menu, under Windows section
     * Component: EmptyPage.tsx
     * Purpose: Save current window arrangement
     */
    SAVE_LAYOUT: 'Save Layout' as const,

    /**
     * LOAD_LAYOUT
     * Location: Header hamburger menu, under Windows section
     * Component: EmptyPage.tsx
     * Purpose: Load a saved window arrangement
     */
    LOAD_LAYOUT: 'Load Layout' as const,
  },

  // ===========================================================================
  // SETTINGS - Labels in the wheel (gear) settings menu
  // ===========================================================================
  SETTINGS: {
    /**
     * PRESETS_SETTING
     * Location: Wheel settings menu
     * Components: ChatControlBox.tsx, ChatFooter.tsx, SettingsMenu.tsx
     * Purpose: Opens the presets management modal
     * Action: Opens PresetsManagementModal
     */
    PRESETS_SETTING: 'Presets Setting' as const,

    /**
     * CATEGORIES_SETTING
     * Location: Wheel settings menu
     * Components: ChatControlBox.tsx, ChatFooter.tsx, SettingsMenu.tsx
     * Purpose: Opens the categories management modal
     * Action: Opens CategoriesSettingsModal
     */
    CATEGORIES_SETTING: 'Categories Setting' as const,

    /**
     * CHAT_THEME
     * Location: Wheel settings menu
     * Components: ChatControlBox.tsx, ChatFooter.tsx, SettingsMenu.tsx, Home.tsx
     * Purpose: Chat-specific styling (bubble colors, fonts, avatar styles)
     * Status: Coming soon (shows toast message)
     * 
     * NOTE: This is CHAT-SPECIFIC theme, different from HEADER.THEME (global)
     * - HEADER.THEME = Dark/Light mode for entire app
     * - SETTINGS.CHAT_THEME = Colors/fonts for chat bubbles only
     */
    CHAT_THEME: 'Chat Theme' as const,

    /**
     * LANGUAGE
     * Location: Wheel settings menu
     * Components: ChatControlBox.tsx, ChatFooter.tsx, SettingsMenu.tsx
     * Purpose: Language selection for the interface
     * Status: Coming soon
     */
    LANGUAGE: 'Language' as const,

    /**
     * EXPORT_DATA
     * Location: Wheel settings menu
     * Components: ChatControlBox.tsx, ChatFooter.tsx, SettingsMenu.tsx
     * Purpose: Export conversation data as JSON
     */
    EXPORT_DATA: 'Export Data' as const,
  },

  // ===========================================================================
  // CHAT_MENU - Labels in the chat hamburger menu (footer)
  // ===========================================================================
  CHAT_MENU: {
    /**
     * NEW_CHAT
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx, FloatingChatWindow.tsx
     * Purpose: Start a new chat in current window
     */
    NEW_CHAT: 'New Chat' as const,

    /**
     * RENAME_CHAT
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx, FloatingChatWindow.tsx
     * Purpose: Rename current conversation
     */
    RENAME_CHAT: 'Rename Chat' as const,

    /**
     * SAVE_CHAT
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx, FloatingChatWindow.tsx
     * Purpose: Save current conversation to localStorage
     */
    SAVE_CHAT: 'Save Chat' as const,

    /**
     * CLEAR_CHAT
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx, FloatingChatWindow.tsx
     * Purpose: Clear all messages in current chat
     */
    CLEAR_CHAT: 'Clear Chat' as const,

    /**
     * SHOW_ANALYTICS
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx, FloatingChatWindow.tsx
     * Purpose: Toggle analytics panel visibility
     */
    SHOW_ANALYTICS: 'Show Analytics' as const,

    /**
     * DELETE_CHAT
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx, FloatingChatWindow.tsx
     * Purpose: Permanently delete current conversation
     */
    DELETE_CHAT: 'Delete Chat' as const,

    /**
     * RECENT_CONVERSATIONS
     * Location: Chat footer hamburger menu section title
     * Component: ChatFooter.tsx
     * Purpose: Section header for recent conversations list
     */
    RECENT_CONVERSATIONS: 'Recent Conversations' as const,

    /**
     * VIEW_ALL_SAVED
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx
     * Purpose: Open modal showing all saved conversations
     */
    VIEW_ALL_SAVED: 'View All Saved' as const,

    /**
     * ARCHIVE
     * Location: Chat footer hamburger menu
     * Component: ChatFooter.tsx
     * Purpose: Show archived conversations count and access
     */
    ARCHIVE: 'Archive' as const,
  },

  // ===========================================================================
  // PRESETS - Labels related to presets functionality
  // ===========================================================================
  PRESETS: {
    /**
     * QUICK_PRESETS
     * Location: Presets panel header
     * Component: PresetsPanel.tsx
     * Purpose: Panel title for quick preset selection
     */
    QUICK_PRESETS: 'Quick Presets' as const,

    /**
     * NEW
     * Location: Presets panel header button
     * Component: PresetsPanel.tsx
     * Purpose: Add new preset to quick presets
     */
    NEW: '+ New' as const,

    /**
     * CREATE_NEW_PRESET
     * Location: Preset selection dialog
     * Component: PresetSelectionDialog.tsx
     * Purpose: Button to create a brand new preset
     */
    CREATE_NEW_PRESET: 'Create New Preset' as const,

    /**
     * EDIT_PRESET
     * Location: Preset editor modal title
     * Component: PresetEditorModal.tsx
     * Purpose: Modal title when editing existing preset
     */
    EDIT_PRESET: 'Edit Preset' as const,

    /**
     * UPDATE_PRESET
     * Location: Preset editor modal button
     * Component: PresetEditorModal.tsx
     * Purpose: Save changes to existing preset
     */
    UPDATE_PRESET: 'Update Preset' as const,

    /**
     * CANCEL
     * Location: Various modals
     * Component: PresetEditorModal.tsx, etc.
     * Purpose: Cancel current action
     */
    CANCEL: 'Cancel' as const,
  },

  // ===========================================================================
  // MODELS - Labels related to model selection
  // ===========================================================================
  MODELS: {
    /**
     * MODELS_BUTTON
     * Location: Chat footer
     * Component: ChatFooter.tsx, FloatingChatWindow.tsx
     * Purpose: Button showing selected model count
     * Format: "X Model" or "X Models"
     */
    MODEL_SINGULAR: 'Model' as const,
    MODEL_PLURAL: 'Models' as const,

    /**
     * SELECT_PROVIDER
     * Location: Model selector panel
     * Component: ModelSelector.tsx
     * Purpose: Dropdown label for provider selection
     */
    SELECT_PROVIDER: 'Select Provider' as const,

    /**
     * SELECT_MODEL
     * Location: Model selector panel
     * Component: ModelSelector.tsx
     * Purpose: Dropdown label for model selection
     */
    SELECT_MODEL: 'Select Model' as const,

    /**
     * ADD_MODEL
     * Location: Model selector panel
     * Component: ModelSelector.tsx
     * Purpose: Button to add selected model
     */
    ADD_MODEL: 'Add' as const,
  },

  // ===========================================================================
  // MODES - Navigation mode labels
  // ===========================================================================
  MODES: {
    /**
     * CHAT
     * Location: Mode dropdown menu
     * Component: ModeMenu.tsx
     * Purpose: Navigate to chat mode / open chat window
     */
    CHAT: 'Chat' as const,

    /**
     * EMPTY
     * Location: Mode dropdown menu
     * Component: ModeMenu.tsx
     * Purpose: Navigate to empty canvas mode
     */
    EMPTY: 'Empty' as const,

    /**
     * CONVERSATION
     * Location: Mode dropdown menu
     * Component: ModeMenu.tsx
     * Purpose: Navigate to conversation mode (coming soon)
     */
    CONVERSATION: 'Conversation' as const,

    /**
     * AGENTS
     * Location: Mode dropdown menu
     * Component: ModeMenu.tsx
     * Purpose: Navigate to agents mode (coming soon)
     */
    AGENTS: 'Agents' as const,

    /**
     * ADD_NEW_CHAT_WINDOW
     * Location: Mode dropdown menu (when windows are open)
     * Component: ModeMenu.tsx, EmptyPage.tsx
     * Purpose: Add another floating chat window
     */
    ADD_NEW_CHAT_WINDOW: 'Add New Chat Window' as const,
  },

  // ===========================================================================
  // COMMON - Common labels used across multiple components
  // ===========================================================================
  COMMON: {
    SAVE: 'Save' as const,
    DELETE: 'Delete' as const,
    EDIT: 'Edit' as const,
    CLOSE: 'Close' as const,
    CONFIRM: 'Confirm' as const,
    CANCEL: 'Cancel' as const,
    SEARCH: 'Search' as const,
    FILTER: 'Filter' as const,
    SORT: 'Sort' as const,
    EXPORT: 'Export' as const,
    IMPORT: 'Import' as const,
    RESET: 'Reset' as const,
    APPLY: 'Apply' as const,
    DONE: 'Done' as const,
    BACK: 'Back' as const,
    NEXT: 'Next' as const,
    LOADING: 'Loading...' as const,
    ERROR: 'Error' as const,
    SUCCESS: 'Success' as const,
    COMING_SOON: 'Coming soon' as const,
  },

  // ===========================================================================
  // ERRORS - Error messages
  // ===========================================================================
  ERRORS: {
    NO_MODELS_SELECTED: 'Please select at least one AI model' as const,
    NO_MESSAGES_TO_SAVE: 'No messages to save' as const,
    NO_MESSAGES_TO_EXPORT: 'No messages to export' as const,
    SAVE_FAILED: 'Failed to save conversation' as const,
    LOAD_FAILED: 'Failed to load conversation' as const,
    MICROPHONE_DENIED: 'Microphone access denied' as const,
  },

  // ===========================================================================
  // TOOLTIPS - Tooltip text
  // ===========================================================================
  TOOLTIPS: {
    ATTACH_FILES: 'Attach files' as const,
    VOICE_INPUT: 'Voice input' as const,
    CONNECTORS: 'Connectors' as const,
    SEND_MESSAGE: 'Send message' as const,
    SYNTHESIZE: 'Generate synthesis from all responses' as const,
    PIN_WINDOW: 'Pin window' as const,
    UNPIN_WINDOW: 'Unpin window' as const,
    MINIMIZE_WINDOW: 'Minimize window' as const,
    MAXIMIZE_WINDOW: 'Maximize window' as const,
    CLOSE_WINDOW: 'Close window' as const,
  },
} as const;

/**
 * Type for the UI_LABELS object
 * Use this for type checking when passing labels as props
 */
export type UILabelsType = typeof UI_LABELS;

/**
 * Helper function to get a label by path
 * @example
 * getLabel('HEADER.THEME') // returns 'Theme'
 */
export function getLabel(path: string): string {
  const parts = path.split('.');
  let current: any = UI_LABELS;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      console.warn(`[FMF] Label not found: ${path}`);
      return path;
    }
    current = current[part];
  }
  
  return current;
}

/**
 * Helper function to format model count label
 * @example
 * getModelCountLabel(0) // "0 Models"
 * getModelCountLabel(1) // "1 Model"
 * getModelCountLabel(3) // "3 Models"
 */
export function getModelCountLabel(count: number): string {
  return `${count} ${count === 1 ? UI_LABELS.MODELS.MODEL_SINGULAR : UI_LABELS.MODELS.MODEL_PLURAL}`;
}
