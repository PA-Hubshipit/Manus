/**
 * RESERVED_TERMS - Protected Vocabulary Registry
 * 
 * These terms have specific meanings in this application and MUST NOT be used
 * for other purposes. Before using any of these terms, check this registry.
 * 
 * @example
 * ```tsx
 * import { RESERVED_TERMS, isTermReserved, getTermConflicts } from '@/lib/fmf';
 * 
 * // Check if a term is reserved
 * if (isTermReserved('Mode')) {
 *   console.log('Cannot use "Mode" - it is reserved for navigation');
 * }
 * 
 * // Get conflicts for a proposed term
 * const conflicts = getTermConflicts('Light Mode');
 * // Returns: ['Mode' is reserved for navigation, use 'Theme' instead]
 * ```
 */

export interface ReservedTerm {
  /** The reserved term */
  term: string;
  /** What this term means in the application */
  meaning: string;
  /** Where this term is used */
  usedIn: string[];
  /** Why this term is reserved */
  reason: string;
  /** Alternative terms that can be used instead */
  alternatives: string[];
  /** Terms that would conflict with this reserved term */
  conflictPatterns: string[];
}

export const RESERVED_TERMS: Record<string, ReservedTerm> = {
  /**
   * MODE
   * Reserved for: Navigation between app views
   * DO NOT use for: Theme switching, display options, or any other toggle
   */
  MODE: {
    term: 'Mode',
    meaning: 'Navigation between different app views (Chat, Empty, Conversation, Agents)',
    usedIn: [
      'ModeMenu.tsx',
      'EmptyPage.tsx',
      'ChatPage.tsx',
      'Header navigation',
    ],
    reason: 'Users associate "Mode" with the navigation dropdown. Using it elsewhere causes confusion.',
    alternatives: ['Theme', 'View', 'Display', 'Style', 'Appearance'],
    conflictPatterns: [
      'Light Mode',
      'Dark Mode',
      'Night Mode',
      'Day Mode',
      'Edit Mode',
      'View Mode',
      'Display Mode',
    ],
  },

  /**
   * THEME
   * Reserved for: Global dark/light appearance toggle
   * DO NOT use for: Chat-specific styling (use "Chat Theme" instead)
   */
  THEME: {
    term: 'Theme',
    meaning: 'Global dark/light mode toggle for the entire application',
    usedIn: [
      'ThemeContext.tsx',
      'ThemeProvider',
      'Hamburger menu',
      'EmptyPage.tsx',
    ],
    reason: 'Theme controls the global appearance. Chat-specific styling uses "Chat Theme".',
    alternatives: ['Chat Theme', 'Color Scheme', 'Appearance', 'Style'],
    conflictPatterns: [
      'Chat Theme', // This is allowed - it's a sub-category
    ],
  },

  /**
   * PRESET
   * Reserved for: Saved model configurations
   * DO NOT use for: Templates, defaults, or other saved configurations
   */
  PRESET: {
    term: 'Preset',
    meaning: 'A saved configuration of AI models that can be quickly applied',
    usedIn: [
      'PresetsPanel.tsx',
      'PresetEditorModal.tsx',
      'PresetsManagementModal.tsx',
      'ChatFooter.tsx',
    ],
    reason: 'Presets specifically refer to model configurations. Other saved configs should use different terms.',
    alternatives: ['Template', 'Configuration', 'Setup', 'Profile'],
    conflictPatterns: [
      'Layout Preset', // Use "Layout" instead
      'Window Preset', // Use "Window Layout" instead
    ],
  },

  /**
   * MODEL
   * Reserved for: AI language models
   * DO NOT use for: Data models, view models, or other programming concepts
   */
  MODEL: {
    term: 'Model',
    meaning: 'An AI language model from a provider (GPT-4, Claude, etc.)',
    usedIn: [
      'ModelSelector.tsx',
      'AI_PROVIDERS constant',
      'ChatFooter.tsx',
      'FloatingChatWindow.tsx',
    ],
    reason: 'In this app context, "Model" always means AI model. Use specific terms for other concepts.',
    alternatives: ['Schema', 'Type', 'Interface', 'Structure'],
    conflictPatterns: [
      'Data Model',
      'View Model',
      'Domain Model',
    ],
  },

  /**
   * PROVIDER
   * Reserved for: AI model providers (OpenAI, Anthropic, etc.)
   * DO NOT use for: Service providers, context providers, or other programming concepts
   */
  PROVIDER: {
    term: 'Provider',
    meaning: 'A company that provides AI models (OpenAI, Anthropic, Google, etc.)',
    usedIn: [
      'AI_PROVIDERS constant',
      'ModelSelector.tsx',
      'PresetsManagementModal.tsx',
    ],
    reason: 'In UI context, "Provider" means AI provider. React providers should use full name.',
    alternatives: ['Context', 'Service', 'Vendor', 'Company'],
    conflictPatterns: [
      'Context Provider', // Use "Context" instead
      'Service Provider',
    ],
  },

  /**
   * CHAT
   * Reserved for: The conversation interface and messages
   * DO NOT use for: General communication features
   */
  CHAT: {
    term: 'Chat',
    meaning: 'A conversation with AI models, including messages and responses',
    usedIn: [
      'FloatingChatWindow.tsx',
      'ChatFooter.tsx',
      'ChatControlBox.tsx',
      'Mode navigation',
    ],
    reason: 'Chat is the core feature. Other communication features should use specific terms.',
    alternatives: ['Conversation', 'Message', 'Dialog', 'Thread'],
    conflictPatterns: [],
  },

  /**
   * WINDOW
   * Reserved for: Floating chat windows
   * DO NOT use for: Browser windows or modal dialogs
   */
  WINDOW: {
    term: 'Window',
    meaning: 'A floating, draggable chat window on the canvas',
    usedIn: [
      'FloatingChatWindow.tsx',
      'WindowDock.tsx',
      'WindowLayoutPresets.tsx',
      'EmptyPage.tsx',
    ],
    reason: 'Window refers to floating chat windows. Use "Modal" or "Dialog" for overlays.',
    alternatives: ['Modal', 'Dialog', 'Panel', 'Overlay'],
    conflictPatterns: [
      'Browser Window',
      'Popup Window',
    ],
  },

  /**
   * SYNTHESIZE / SYNTHESIS
   * Reserved for: Combining multiple AI responses into one
   * DO NOT use for: General combining or merging operations
   */
  SYNTHESIZE: {
    term: 'Synthesize',
    meaning: 'Generate a combined response from multiple AI model outputs',
    usedIn: [
      'FloatingChatWindow.tsx',
      'ChatFooter.tsx',
      'Sparkles icon button',
    ],
    reason: 'Synthesis is a specific feature. Other combining operations should use different terms.',
    alternatives: ['Combine', 'Merge', 'Aggregate', 'Summarize'],
    conflictPatterns: [],
  },

  /**
   * CONNECTOR
   * Reserved for: External service integrations
   * DO NOT use for: UI connectors or data connectors
   */
  CONNECTOR: {
    term: 'Connector',
    meaning: 'An integration with an external service (Browser, Gmail, Calendar, etc.)',
    usedIn: [
      'ConnectorsStore.tsx',
      'ChatFooter.tsx',
      'Plug icon button',
    ],
    reason: 'Connectors are external integrations. Internal connections should use different terms.',
    alternatives: ['Integration', 'Plugin', 'Extension', 'Service'],
    conflictPatterns: [],
  },

  /**
   * CATEGORY
   * Reserved for: Preset organization categories
   * DO NOT use for: General grouping or classification
   */
  CATEGORY: {
    term: 'Category',
    meaning: 'A grouping for organizing presets (Coding, Writing, Research, etc.)',
    usedIn: [
      'CategoriesSettingsModal.tsx',
      'PresetSelectionDialog.tsx',
      'PresetsPanel.tsx',
    ],
    reason: 'Category specifically organizes presets. Use "Group" or "Type" for other classifications.',
    alternatives: ['Group', 'Type', 'Tag', 'Label', 'Folder'],
    conflictPatterns: [],
  },
};

/**
 * Check if a term is reserved
 * @param term The term to check
 * @returns true if the term is reserved
 */
export function isTermReserved(term: string): boolean {
  const normalizedTerm = term.toLowerCase();
  
  for (const reserved of Object.values(RESERVED_TERMS)) {
    if (reserved.term.toLowerCase() === normalizedTerm) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get conflicts for a proposed term
 * @param proposedTerm The term you want to use
 * @returns Array of conflict messages, empty if no conflicts
 */
export function getTermConflicts(proposedTerm: string): string[] {
  const conflicts: string[] = [];
  const normalizedTerm = proposedTerm.toLowerCase();
  
  for (const reserved of Object.values(RESERVED_TERMS)) {
    // Check if the proposed term matches a conflict pattern
    for (const pattern of reserved.conflictPatterns) {
      if (normalizedTerm.includes(pattern.toLowerCase())) {
        conflicts.push(
          `"${proposedTerm}" conflicts with reserved term "${reserved.term}". ` +
          `${reserved.reason} Consider using: ${reserved.alternatives.join(', ')}`
        );
      }
    }
    
    // Check if the proposed term contains the reserved term
    if (normalizedTerm.includes(reserved.term.toLowerCase()) && 
        normalizedTerm !== reserved.term.toLowerCase()) {
      // Special case: "Chat Theme" is allowed as a sub-category of "Theme"
      if (reserved.term === 'Theme' && normalizedTerm === 'chat theme') {
        continue;
      }
      
      conflicts.push(
        `"${proposedTerm}" contains reserved term "${reserved.term}". ` +
        `${reserved.reason} Consider using: ${reserved.alternatives.join(', ')}`
      );
    }
  }
  
  return conflicts;
}

/**
 * Get the reserved term entry for a term
 * @param term The term to look up
 * @returns The ReservedTerm entry or undefined
 */
export function getReservedTerm(term: string): ReservedTerm | undefined {
  const normalizedTerm = term.toUpperCase();
  return RESERVED_TERMS[normalizedTerm];
}

/**
 * Get all reserved terms as an array
 * @returns Array of all reserved terms
 */
export function getAllReservedTerms(): string[] {
  return Object.values(RESERVED_TERMS).map(rt => rt.term);
}
