/**
 * RELATIONSHIPS - Component and Feature Relationships Registry
 * 
 * Registry of relationships between components, features, and data.
 * Use this to understand what changes together and what might break.
 * 
 * @example
 * ```tsx
 * import { RELATIONSHIPS } from '@/lib/fmf';
 * 
 * // Check what's affected by changing presets
 * const affected = RELATIONSHIPS.PRESETS.affectedBy;
 * console.log('Changing presets affects:', affected);
 * ```
 */

export interface RelationshipEntry {
  /** The entity name */
  name: string;
  /** What this entity affects when changed */
  affects: string[];
  /** What affects this entity */
  affectedBy: string[];
  /** Data that this entity owns/manages */
  owns: string[];
  /** Data that this entity uses but doesn't own */
  uses: string[];
  /** Events that this entity emits */
  emits: string[];
  /** Events that this entity listens to */
  listensTo: string[];
}

export interface RelationshipMap {
  [key: string]: RelationshipEntry;
}

export const RELATIONSHIPS: RelationshipMap = {
  // ===========================================================================
  // FEATURE RELATIONSHIPS
  // ===========================================================================

  PRESETS: {
    name: 'Presets Feature',
    affects: [
      'PresetsPanel UI',
      'PresetEditorModal UI',
      'PresetsManagementModal UI',
      'PresetSelectionDialog UI',
      'Model selection in FloatingChatWindow',
      'Quick presets localStorage',
      'Custom presets localStorage',
    ],
    affectedBy: [
      'AI_PROVIDERS constant changes',
      'Category changes',
      'localStorage schema changes',
    ],
    owns: [
      'customPresets state',
      'quickPresets state',
      'presetUsage state',
      'presetVersions state',
    ],
    uses: [
      'AI_PROVIDERS',
      'categories',
      'selectedModels',
    ],
    emits: [
      'onSelectPreset',
      'onSavePreset',
      'onDeletePreset',
    ],
    listensTo: [
      'category changes',
      'model availability changes',
    ],
  },

  CATEGORIES: {
    name: 'Categories Feature',
    affects: [
      'CategoriesSettingsModal UI',
      'PresetEditorModal category dropdown',
      'PresetSelectionDialog category filter',
      'Preset organization',
    ],
    affectedBy: [
      'Preset deletion (orphaned categories)',
    ],
    owns: [
      'customCategories state',
    ],
    uses: [
      'presets (for assignment)',
    ],
    emits: [
      'onCategoryCreate',
      'onCategoryUpdate',
      'onCategoryDelete',
    ],
    listensTo: [
      'preset changes',
    ],
  },

  MODELS: {
    name: 'Model Selection Feature',
    affects: [
      'ModelSelector UI',
      'FloatingChatWindow model badges',
      'ChatFooter model count',
      'AI response generation',
      'Preset model lists',
    ],
    affectedBy: [
      'AI_PROVIDERS constant changes',
      'Preset selection',
      'Default models setting',
    ],
    owns: [
      'selectedModels state',
      'defaultModels state',
    ],
    uses: [
      'AI_PROVIDERS',
      'presets',
    ],
    emits: [
      'onModelsChange',
    ],
    listensTo: [
      'preset selection',
      'model availability changes',
    ],
  },

  CONVERSATIONS: {
    name: 'Conversations Feature',
    affects: [
      'FloatingChatWindow messages',
      'SavedConversationsModal list',
      'ChatFooter recent conversations',
      'Analytics data',
    ],
    affectedBy: [
      'Message sending',
      'AI responses',
      'User actions (save, delete, archive)',
    ],
    owns: [
      'messages state',
      'savedConversations state',
      'archivedConversations state',
      'currentTitle state',
    ],
    uses: [
      'selectedModels',
      'analytics',
    ],
    emits: [
      'onSave',
      'onLoad',
      'onDelete',
      'onArchive',
      'onNewChat',
    ],
    listensTo: [
      'AI response events',
      'user input events',
    ],
  },

  WINDOWS: {
    name: 'Floating Windows Feature',
    affects: [
      'FloatingChatWindow position/size',
      'WindowDock minimized list',
      'WindowLayoutPresets saved layouts',
      'EmptyPage window management',
    ],
    affectedBy: [
      'User drag/resize actions',
      'Layout preset loading',
      'Window minimize/maximize',
    ],
    owns: [
      'windowPositions state',
      'windowLayouts state',
      'minimizedWindows state',
      'activeWindows state',
    ],
    uses: [
      'viewport dimensions',
    ],
    emits: [
      'onClose',
      'onMinimize',
      'onMaximize',
      'onBringToFront',
      'onPositionChange',
      'onSizeChange',
    ],
    listensTo: [
      'viewport resize',
      'layout preset selection',
    ],
  },

  THEME: {
    name: 'Theme Feature',
    affects: [
      'All component colors',
      'ThemeProvider context',
      'localStorage theme key',
      'CSS variables',
    ],
    affectedBy: [
      'User theme toggle',
      'System preference',
    ],
    owns: [
      'theme state',
    ],
    uses: [
      'system color scheme preference',
    ],
    emits: [
      'onThemeChange',
    ],
    listensTo: [
      'system preference changes',
    ],
  },

  NAVIGATION: {
    name: 'Navigation Feature',
    affects: [
      'ModeMenu current selection',
      'Router location',
      'Page component rendering',
    ],
    affectedBy: [
      'User mode selection',
      'Direct URL navigation',
    ],
    owns: [
      'currentMode state',
    ],
    uses: [
      'ROUTES registry',
      'window count (for Chat mode)',
    ],
    emits: [
      'onModeChange',
    ],
    listensTo: [
      'route changes',
      'window open/close',
    ],
  },

  CONNECTORS: {
    name: 'Connectors Feature',
    affects: [
      'ConnectorsStore UI',
      'ChatFooter connector button',
      'AI context (when enabled)',
    ],
    affectedBy: [
      'User enable/disable actions',
      'External service availability',
    ],
    owns: [
      'enabledConnectors state',
    ],
    uses: [
      'external service APIs',
    ],
    emits: [
      'onConnectorEnable',
      'onConnectorDisable',
    ],
    listensTo: [
      'service availability changes',
    ],
  },

  ANALYTICS: {
    name: 'Analytics Feature',
    affects: [
      'AnalyticsPanel charts',
      'Preset usage statistics',
    ],
    affectedBy: [
      'Message sending',
      'Preset usage',
      'Conversation saves',
    ],
    owns: [
      'analyticsData state',
      'presetUsage state',
    ],
    uses: [
      'messages',
      'conversations',
      'presets',
    ],
    emits: [],
    listensTo: [
      'message events',
      'preset selection events',
      'conversation events',
    ],
  },

  // ===========================================================================
  // DATA RELATIONSHIPS
  // ===========================================================================

  AI_PROVIDERS: {
    name: 'AI Providers Constant',
    affects: [
      'ModelSelector provider list',
      'ModelSelector model list',
      'PresetEditorModal model selection',
      'PresetsManagementModal model selection',
      'All preset model validation',
    ],
    affectedBy: [
      'Code changes only (constant)',
    ],
    owns: [],
    uses: [],
    emits: [],
    listensTo: [],
  },

  LOCALSTORAGE: {
    name: 'LocalStorage Data',
    affects: [
      'All persisted state on page load',
      'Cross-tab synchronization',
    ],
    affectedBy: [
      'State changes in any component',
      'User clearing browser data',
      'Storage quota limits',
    ],
    owns: [
      'All STATE_KEYS with storage: localStorage',
    ],
    uses: [],
    emits: [
      'storage event (cross-tab)',
    ],
    listensTo: [
      'state changes',
    ],
  },
};

/**
 * Get what a feature affects
 * @param featureName The feature to check
 * @returns Array of affected items
 */
export function getAffects(featureName: string): string[] {
  const relationship = RELATIONSHIPS[featureName];
  if (!relationship) {
    console.warn(`[FMF] Relationship not found: ${featureName}`);
    return [];
  }
  return relationship.affects;
}

/**
 * Get what affects a feature
 * @param featureName The feature to check
 * @returns Array of items that affect this feature
 */
export function getAffectedBy(featureName: string): string[] {
  const relationship = RELATIONSHIPS[featureName];
  if (!relationship) {
    console.warn(`[FMF] Relationship not found: ${featureName}`);
    return [];
  }
  return relationship.affectedBy;
}

/**
 * Get all features that would be impacted by changing a feature
 * @param featureName The feature being changed
 * @returns Array of impacted feature names
 */
export function getImpactedFeatures(featureName: string): string[] {
  const impacted = new Set<string>();
  
  // Direct impacts
  const relationship = RELATIONSHIPS[featureName];
  if (relationship) {
    for (const affected of relationship.affects) {
      // Find features that own or use the affected item
      for (const [key, rel] of Object.entries(RELATIONSHIPS)) {
        if (rel.owns.some(o => affected.includes(o)) ||
            rel.uses.some(u => affected.includes(u))) {
          impacted.add(key);
        }
      }
    }
  }
  
  // Features that list this feature in affectedBy
  for (const [key, rel] of Object.entries(RELATIONSHIPS)) {
    if (rel.affectedBy.some(a => a.toLowerCase().includes(featureName.toLowerCase()))) {
      impacted.add(key);
    }
  }
  
  return Array.from(impacted);
}

/**
 * Get the event flow for a feature
 * @param featureName The feature to check
 * @returns Object with emits and listensTo arrays
 */
export function getEventFlow(featureName: string): { emits: string[]; listensTo: string[] } {
  const relationship = RELATIONSHIPS[featureName];
  if (!relationship) {
    return { emits: [], listensTo: [] };
  }
  return {
    emits: relationship.emits,
    listensTo: relationship.listensTo,
  };
}

/**
 * Check if two features are related
 * @param feature1 First feature
 * @param feature2 Second feature
 * @returns true if the features are related
 */
export function areFeaturesRelated(feature1: string, feature2: string): boolean {
  const rel1 = RELATIONSHIPS[feature1];
  const rel2 = RELATIONSHIPS[feature2];
  
  if (!rel1 || !rel2) return false;
  
  // Check if feature1 affects something feature2 owns/uses
  for (const affected of rel1.affects) {
    if (rel2.owns.some(o => affected.includes(o)) ||
        rel2.uses.some(u => affected.includes(u))) {
      return true;
    }
  }
  
  // Check if feature2 affects something feature1 owns/uses
  for (const affected of rel2.affects) {
    if (rel1.owns.some(o => affected.includes(o)) ||
        rel1.uses.some(u => affected.includes(u))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Get all features
 * @returns Array of feature names
 */
export function getAllFeatures(): string[] {
  return Object.keys(RELATIONSHIPS);
}
