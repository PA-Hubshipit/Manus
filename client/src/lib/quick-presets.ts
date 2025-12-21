import { MODEL_PRESETS } from './ai-providers';

export interface QuickPreset {
  id: string;
  sourceId: string; // ID of the original preset (built-in key or custom preset ID)
  sourceType: 'built-in' | 'custom';
  name: string; // Can be modified locally
  description?: string; // Brief description of the preset's use case
  models: string[]; // Can be modified locally
  isModified: boolean; // True if name or models differ from source
  isFavorite?: boolean; // True if preset is pinned/starred
}

const STORAGE_KEY = 'quickPresets';

/**
 * Load Quick Presets from localStorage
 */
export function loadQuickPresets(): QuickPreset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load quick presets:', error);
  }
  
  // Return default built-in presets if nothing stored
  return initializeDefaultQuickPresets();
}

/**
 * Save Quick Presets to localStorage
 */
export function saveQuickPresets(presets: QuickPreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Failed to save quick presets:', error);
  }
}

/**
 * Initialize default Quick Presets from built-in presets
 */
function initializeDefaultQuickPresets(): QuickPreset[] {
  const builtInKeys = Object.keys(MODEL_PRESETS);
  return builtInKeys.map((key) => {
    const preset = MODEL_PRESETS[key as keyof typeof MODEL_PRESETS];
    return {
      id: `quick-${Date.now()}-${Math.random()}`,
      sourceId: key,
      sourceType: 'built-in' as const,
      name: preset.name,
      description: preset.description,
      models: [...preset.models],
      isModified: false,
      isFavorite: false,
    };
  });
}

/**
 * Add new presets to Quick Presets
 */
export function addQuickPresets(
  currentPresets: QuickPreset[],
  newPresets: Array<{ sourceId: string; sourceType: 'built-in' | 'custom'; name: string; description?: string; models: string[] }>
): QuickPreset[] {
  const added = newPresets.map((preset) => ({
    id: `quick-${Date.now()}-${Math.random()}`,
    sourceId: preset.sourceId,
    sourceType: preset.sourceType,
    name: preset.name,
    description: preset.description,
    models: [...preset.models],
    isModified: false,
    isFavorite: false,
  }));
  
  return [...currentPresets, ...added];
}

/**
 * Update a Quick Preset
 */
export function updateQuickPreset(
  presets: QuickPreset[],
  id: string,
  updates: Partial<Pick<QuickPreset, 'name' | 'models' | 'description' | 'isFavorite'>>
): QuickPreset[] {
  return presets.map((preset) => {
    if (preset.id !== id) return preset;
    
    const updated = { ...preset, ...updates };
    
    // Check if modified from source
    if (preset.sourceType === 'built-in') {
      const source = MODEL_PRESETS[preset.sourceId as keyof typeof MODEL_PRESETS];
      if (source) {
        updated.isModified =
          updated.name !== source.name ||
          JSON.stringify(updated.models.sort()) !== JSON.stringify([...source.models].sort());
      }
    }
    
    return updated;
  });
}

/**
 * Remove a Quick Preset
 */
export function removeQuickPreset(presets: QuickPreset[], id: string): QuickPreset[] {
  return presets.filter((preset) => preset.id !== id);
}

/**
 * Reorder Quick Presets
 */
export function reorderQuickPresets(presets: QuickPreset[], startIndex: number, endIndex: number): QuickPreset[] {
  const result = Array.from(presets);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

/**
 * Toggle favorite status of a Quick Preset
 */
export function toggleFavorite(presets: QuickPreset[], id: string): QuickPreset[] {
  return presets.map((preset) => {
    if (preset.id !== id) return preset;
    return { ...preset, isFavorite: !preset.isFavorite };
  });
}

/**
 * Sort presets with favorites at the top
 */
export function sortByFavorite(presets: QuickPreset[]): QuickPreset[] {
  return [...presets].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return 0;
  });
}

/**
 * Export presets to JSON string
 */
export function exportPresets(presets: QuickPreset[]): string {
  const exportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    presets: presets.map(p => ({
      name: p.name,
      description: p.description,
      models: p.models,
      sourceType: p.sourceType,
      sourceId: p.sourceId,
      isFavorite: p.isFavorite,
    })),
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import presets from JSON string
 */
export function importPresets(jsonString: string): QuickPreset[] | null {
  try {
    const data = JSON.parse(jsonString);
    if (!data.presets || !Array.isArray(data.presets)) {
      return null;
    }
    return data.presets.map((p: any) => ({
      id: `quick-${Date.now()}-${Math.random()}`,
      sourceId: p.sourceId || `imported-${Date.now()}`,
      sourceType: p.sourceType || 'custom',
      name: p.name,
      description: p.description,
      models: p.models || [],
      isModified: false,
      isFavorite: p.isFavorite || false,
    }));
  } catch (error) {
    console.error('Failed to import presets:', error);
    return null;
  }
}
