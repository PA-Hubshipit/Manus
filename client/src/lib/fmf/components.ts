/**
 * COMPONENTS - Component Registry
 * 
 * Registry of all major components with their dependencies and dependents.
 * Before modifying any component, check this registry to understand impact.
 * 
 * @example
 * ```tsx
 * import { COMPONENTS, getComponentDependents } from '@/lib/fmf';
 * 
 * // Check what depends on a component before modifying
 * const dependents = getComponentDependents('ChatFooter');
 * console.log('These components will be affected:', dependents);
 * 
 * // Check component metadata
 * const info = COMPONENTS.FloatingChatWindow;
 * console.log('Props:', info.props);
 * console.log('Breaking changes:', info.breakingChanges);
 * ```
 */

export interface ComponentEntry {
  /** Component name */
  name: string;
  /** File path relative to client/src/ */
  path: string;
  /** Brief description of the component's purpose */
  description: string;
  /** Components that this component uses (dependencies) */
  dependencies: string[];
  /** Components that use this component (dependents) */
  dependents: string[];
  /** Props that this component accepts */
  props: string[];
  /** Changes that would break dependents */
  breakingChanges: string[];
  /** Related components that often change together */
  relatedComponents: string[];
  /** Z-index layer this component uses (if applicable) */
  zIndexLayer?: string;
}

export const COMPONENTS: Record<string, ComponentEntry> = {
  // ===========================================================================
  // CORE LAYOUT COMPONENTS
  // ===========================================================================
  
  FloatingChatWindow: {
    name: 'FloatingChatWindow',
    path: 'components/FloatingChatWindow.tsx',
    description: 'Draggable, resizable chat window that floats on the canvas',
    dependencies: [
      'ChatFooter',
      'ModelSelector',
      'PresetsPanel',
      'SettingsMenu',
      'PresetEditorModal',
      'PresetsManagementModal',
      'SavedConversationsModal',
      'AnalyticsPanel',
      'ConnectorsStore',
    ],
    dependents: [
      'EmptyPage',
    ],
    props: [
      'id',
      'initialPosition',
      'initialSize',
      'onClose',
      'onMinimize',
      'onBringToFront',
      'zIndex',
    ],
    breakingChanges: [
      'Removing or renaming props',
      'Changing position/size state structure',
      'Modifying drag/resize behavior',
      'Changing z-index management',
    ],
    relatedComponents: ['WindowDock', 'WindowLayoutPresets'],
    zIndexLayer: 'FLOATING',
  },

  ChatFooter: {
    name: 'ChatFooter',
    path: 'components/ChatFooter.tsx',
    description: 'Footer controls for chat including menu, models, presets, settings',
    dependencies: [
      'ModelSelector',
      'PresetsPanel',
      'SettingsMenu',
    ],
    dependents: [
      'FloatingChatWindow',
      'ChatControlBox',
    ],
    props: [
      'selectedModels',
      'onModelsChange',
      'onSend',
      'onNewChat',
      'messages',
      'savedConversations',
      'archivedConversations',
      'currentTitle',
      'onTitleChange',
      'onSave',
      'onLoad',
      'onDelete',
      'onExport',
      'onSynthesize',
      'onShowAnalytics',
      'showAnalytics',
    ],
    breakingChanges: [
      'Removing or renaming callback props',
      'Changing message/conversation data structure',
      'Modifying menu item order or content',
    ],
    relatedComponents: ['FloatingChatWindow', 'ChatControlBox'],
    zIndexLayer: 'FLOATING',
  },

  ChatControlBox: {
    name: 'ChatControlBox',
    path: 'components/ChatControlBox.tsx',
    description: 'Self-contained chat control component with all built-in behaviors',
    dependencies: [
      'ModelSelector',
      'PresetsPanel',
      'SettingsMenu',
      'PresetEditorModal',
      'PresetsManagementModal',
      'CategoriesSettingsModal',
      'ConnectorsStore',
    ],
    dependents: [],
    props: [
      'onSendMessage',
      'onModelsChange',
      'initialModels',
      'className',
    ],
    breakingChanges: [
      'Removing or renaming callback props',
      'Changing internal state management',
    ],
    relatedComponents: ['ChatFooter'],
    zIndexLayer: 'FLOATING',
  },

  // ===========================================================================
  // PRESET COMPONENTS
  // ===========================================================================

  PresetsPanel: {
    name: 'PresetsPanel',
    path: 'components/PresetsPanel.tsx',
    description: 'Quick presets selection panel',
    dependencies: [
      'PresetSelectionDialog',
      'PresetEditorModal',
    ],
    dependents: [
      'FloatingChatWindow',
      'ChatFooter',
      'ChatControlBox',
    ],
    props: [
      'onSelectPreset',
      'onClose',
      'customPresets',
      'onSaveCustomPresets',
      'onOpenPresetsManagement',
    ],
    breakingChanges: [
      'Changing preset data structure',
      'Modifying selection callback signature',
    ],
    relatedComponents: ['PresetEditorModal', 'PresetsManagementModal', 'PresetSelectionDialog'],
  },

  PresetEditorModal: {
    name: 'PresetEditorModal',
    path: 'components/PresetEditorModal.tsx',
    description: 'Modal for creating and editing presets',
    dependencies: [],
    dependents: [
      'PresetsPanel',
      'PresetsManagementModal',
      'FloatingChatWindow',
      'ChatControlBox',
    ],
    props: [
      'isOpen',
      'onClose',
      'preset',
      'onSave',
      'AI_PROVIDERS',
    ],
    breakingChanges: [
      'Changing preset data structure',
      'Modifying save callback signature',
    ],
    relatedComponents: ['PresetsPanel', 'PresetsManagementModal'],
    zIndexLayer: 'MODAL',
  },

  PresetsManagementModal: {
    name: 'PresetsManagementModal',
    path: 'components/PresetsManagementModal.tsx',
    description: 'Full preset management with tabs for presets and default models',
    dependencies: [
      'PresetEditorModal',
    ],
    dependents: [
      'FloatingChatWindow',
      'ChatControlBox',
      'SettingsMenu',
    ],
    props: [
      'AI_PROVIDERS',
      'customPresets',
      'builtInPresets',
      'defaultModels',
      'onSaveCustomPresets',
      'onSaveDefaultModels',
      'onClose',
    ],
    breakingChanges: [
      'Changing preset/model data structure',
      'Modifying tab structure',
    ],
    relatedComponents: ['PresetsPanel', 'PresetEditorModal'],
    zIndexLayer: 'MODAL',
  },

  PresetSelectionDialog: {
    name: 'PresetSelectionDialog',
    path: 'components/PresetSelectionDialog.tsx',
    description: 'Dialog for selecting presets to add to quick presets',
    dependencies: [],
    dependents: [
      'PresetsPanel',
    ],
    props: [
      'isOpen',
      'onClose',
      'onSelectPreset',
      'availablePresets',
      'existingPresetIds',
    ],
    breakingChanges: [
      'Changing preset data structure',
      'Modifying selection callback signature',
    ],
    relatedComponents: ['PresetsPanel'],
    zIndexLayer: 'MODAL',
  },

  // ===========================================================================
  // MODEL COMPONENTS
  // ===========================================================================

  ModelSelector: {
    name: 'ModelSelector',
    path: 'components/ModelSelector.tsx',
    description: 'Provider and model selection dropdowns',
    dependencies: [],
    dependents: [
      'FloatingChatWindow',
      'ChatFooter',
      'ChatControlBox',
    ],
    props: [
      'selectedModels',
      'onModelsChange',
      'onClose',
    ],
    breakingChanges: [
      'Changing model key format (provider:model)',
      'Modifying AI_PROVIDERS structure',
    ],
    relatedComponents: [],
    zIndexLayer: 'DROPDOWN',
  },

  // ===========================================================================
  // SETTINGS COMPONENTS
  // ===========================================================================

  SettingsMenu: {
    name: 'SettingsMenu',
    path: 'components/SettingsMenu.tsx',
    description: 'Settings dropdown menu (wheel icon)',
    dependencies: [],
    dependents: [
      'FloatingChatWindow',
      'ChatFooter',
      'ChatControlBox',
    ],
    props: [
      'onOpenPresetsManagement',
      'onOpenCategoriesSettings',
      'onExport',
      'onClose',
    ],
    breakingChanges: [
      'Changing menu item order',
      'Removing menu items',
    ],
    relatedComponents: ['PresetsManagementModal', 'CategoriesSettingsModal'],
    zIndexLayer: 'DROPDOWN',
  },

  CategoriesSettingsModal: {
    name: 'CategoriesSettingsModal',
    path: 'components/CategoriesSettingsModal.tsx',
    description: 'Modal for managing preset categories',
    dependencies: [],
    dependents: [
      'SettingsMenu',
      'ChatControlBox',
    ],
    props: [
      'isOpen',
      'onClose',
    ],
    breakingChanges: [
      'Changing category data structure',
    ],
    relatedComponents: ['SettingsMenu'],
    zIndexLayer: 'MODAL',
  },

  // ===========================================================================
  // PAGE COMPONENTS
  // ===========================================================================

  EmptyPage: {
    name: 'EmptyPage',
    path: 'pages/EmptyPage.tsx',
    description: 'Main canvas page with floating windows',
    dependencies: [
      'FloatingChatWindow',
      'WindowDock',
      'WindowLayoutPresets',
      'ModeMenu',
    ],
    dependents: [
      'App (router)',
    ],
    props: [],
    breakingChanges: [
      'Changing window management logic',
      'Modifying hamburger menu structure',
    ],
    relatedComponents: ['AgentsPage', 'ConversationPage'],
  },

  ModeMenu: {
    name: 'ModeMenu',
    path: 'components/ModeMenu.tsx',
    description: 'Navigation dropdown for switching between app modes',
    dependencies: [],
    dependents: [
      'EmptyPage',
      'AgentsPage',
      'ConversationPage',
    ],
    props: [
      'currentMode',
      'onModeChange',
      'windowCount',
    ],
    breakingChanges: [
      'Changing mode values',
      'Modifying navigation behavior',
    ],
    relatedComponents: [],
    zIndexLayer: 'DROPDOWN',
  },

  // ===========================================================================
  // UTILITY COMPONENTS
  // ===========================================================================

  WindowDock: {
    name: 'WindowDock',
    path: 'components/WindowDock.tsx',
    description: 'Dock at bottom for minimized windows',
    dependencies: [],
    dependents: [
      'EmptyPage',
    ],
    props: [
      'minimizedWindows',
      'onRestore',
      'onClose',
    ],
    breakingChanges: [
      'Changing minimized window data structure',
    ],
    relatedComponents: ['FloatingChatWindow'],
    zIndexLayer: 'DROPDOWN',
  },

  WindowLayoutPresets: {
    name: 'WindowLayoutPresets',
    path: 'components/WindowLayoutPresets.tsx',
    description: 'Save and load window layout configurations',
    dependencies: [],
    dependents: [
      'EmptyPage',
    ],
    props: [
      'onSaveLayout',
      'onLoadLayout',
      'savedLayouts',
    ],
    breakingChanges: [
      'Changing layout data structure',
    ],
    relatedComponents: ['FloatingChatWindow'],
    zIndexLayer: 'MODAL',
  },

  ConnectorsStore: {
    name: 'ConnectorsStore',
    path: 'components/ConnectorsStore.tsx',
    description: 'Bottom sheet for managing external connectors',
    dependencies: [],
    dependents: [
      'FloatingChatWindow',
      'ChatControlBox',
    ],
    props: [
      'isOpen',
      'onClose',
    ],
    breakingChanges: [
      'Changing connector data structure',
    ],
    relatedComponents: [],
    zIndexLayer: 'MODAL',
  },

  SavedConversationsModal: {
    name: 'SavedConversationsModal',
    path: 'components/SavedConversationsModal.tsx',
    description: 'Modal for viewing and managing all saved conversations',
    dependencies: [],
    dependents: [
      'FloatingChatWindow',
    ],
    props: [
      'isOpen',
      'onClose',
      'conversations',
      'archivedConversations',
      'onLoad',
      'onDelete',
      'onArchive',
      'onUnarchive',
    ],
    breakingChanges: [
      'Changing conversation data structure',
    ],
    relatedComponents: [],
    zIndexLayer: 'MODAL',
  },

  AnalyticsPanel: {
    name: 'AnalyticsPanel',
    path: 'components/AnalyticsPanel.tsx',
    description: 'Panel showing chat analytics and statistics',
    dependencies: [],
    dependents: [
      'FloatingChatWindow',
    ],
    props: [
      'isOpen',
      'onClose',
      'messages',
      'conversations',
    ],
    breakingChanges: [
      'Changing analytics data structure',
    ],
    relatedComponents: [],
    zIndexLayer: 'MODAL',
  },
};

/**
 * Get all components that depend on a given component
 * @param componentName The component to check
 * @returns Array of component names that depend on this component
 */
export function getComponentDependents(componentName: string): string[] {
  const component = COMPONENTS[componentName];
  if (!component) {
    console.warn(`[FMF] Component not found: ${componentName}`);
    return [];
  }
  return component.dependents;
}

/**
 * Get all components that a given component depends on
 * @param componentName The component to check
 * @returns Array of component names that this component depends on
 */
export function getComponentDependencies(componentName: string): string[] {
  const component = COMPONENTS[componentName];
  if (!component) {
    console.warn(`[FMF] Component not found: ${componentName}`);
    return [];
  }
  return component.dependencies;
}

/**
 * Get the full dependency tree for a component (recursive)
 * @param componentName The component to check
 * @returns Set of all component names in the dependency tree
 */
export function getFullDependencyTree(componentName: string): Set<string> {
  const tree = new Set<string>();
  const visited = new Set<string>();
  
  function traverse(name: string) {
    if (visited.has(name)) return;
    visited.add(name);
    
    const component = COMPONENTS[name];
    if (!component) return;
    
    for (const dep of component.dependencies) {
      tree.add(dep);
      traverse(dep);
    }
  }
  
  traverse(componentName);
  return tree;
}

/**
 * Get all components that would be affected by changing a component
 * @param componentName The component being changed
 * @returns Array of component names that would be affected
 */
export function getAffectedComponents(componentName: string): string[] {
  const affected = new Set<string>();
  const visited = new Set<string>();
  
  function traverse(name: string) {
    if (visited.has(name)) return;
    visited.add(name);
    
    const component = COMPONENTS[name];
    if (!component) return;
    
    for (const dependent of component.dependents) {
      affected.add(dependent);
      traverse(dependent);
    }
  }
  
  traverse(componentName);
  return Array.from(affected);
}

/**
 * Check if a prop change would be breaking
 * @param componentName The component being changed
 * @param propName The prop being changed
 * @returns true if this is a breaking change
 */
export function isBreakingPropChange(componentName: string, propName: string): boolean {
  const component = COMPONENTS[componentName];
  if (!component) return false;
  
  return component.props.includes(propName);
}

/**
 * Get component by path
 * @param path The file path to search for
 * @returns The component entry or undefined
 */
export function getComponentByPath(path: string): ComponentEntry | undefined {
  return Object.values(COMPONENTS).find(c => c.path === path || c.path.endsWith(path));
}
