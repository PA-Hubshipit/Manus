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
  usageCount?: number; // Number of times preset has been used
  lastUsedAt?: string; // ISO timestamp of last usage
}

const STORAGE_KEY = 'quickPresets';
const USAGE_STORAGE_KEY = 'presetUsageStats';

/**
 * Usage statistics for presets
 */
export interface PresetUsageStats {
  [presetId: string]: {
    usageCount: number;
    lastUsedAt: string;
  };
}

/**
 * Load usage stats from localStorage
 */
export function loadUsageStats(): PresetUsageStats {
  try {
    const stored = localStorage.getItem(USAGE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load usage stats:', error);
  }
  return {};
}

/**
 * Save usage stats to localStorage
 */
export function saveUsageStats(stats: PresetUsageStats): void {
  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save usage stats:', error);
  }
}

/**
 * Track preset usage - call this when a preset is applied
 */
export function trackPresetUsage(presetId: string): PresetUsageStats {
  const stats = loadUsageStats();
  const existing = stats[presetId] || { usageCount: 0, lastUsedAt: '' };
  stats[presetId] = {
    usageCount: existing.usageCount + 1,
    lastUsedAt: new Date().toISOString(),
  };
  saveUsageStats(stats);
  return stats;
}

/**
 * Get usage count for a preset
 */
export function getPresetUsageCount(presetId: string): number {
  const stats = loadUsageStats();
  return stats[presetId]?.usageCount || 0;
}

/**
 * Get most used presets sorted by usage count
 */
export function getMostUsedPresets(presets: QuickPreset[], limit: number = 5): QuickPreset[] {
  const stats = loadUsageStats();
  return [...presets]
    .map(p => ({ ...p, usageCount: stats[p.id]?.usageCount || 0 }))
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
}

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


/**
 * Generate a shareable URL for a preset
 * The preset data is encoded in base64 in the URL hash
 */
export function generateShareableUrl(preset: QuickPreset): string {
  const shareData = {
    name: preset.name,
    description: preset.description,
    models: preset.models,
  };
  const encoded = btoa(JSON.stringify(shareData));
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#preset=${encoded}`;
}

/**
 * Parse a preset from a shareable URL
 * Returns null if the URL doesn't contain valid preset data
 */
export function parsePresetFromUrl(url: string): { name: string; description?: string; models: string[] } | null {
  try {
    const hashIndex = url.indexOf('#preset=');
    if (hashIndex === -1) return null;
    
    const encoded = url.substring(hashIndex + 8);
    const decoded = atob(encoded);
    const data = JSON.parse(decoded);
    
    if (!data.name || !Array.isArray(data.models)) {
      return null;
    }
    
    return {
      name: data.name,
      description: data.description,
      models: data.models,
    };
  } catch (error) {
    console.error('Failed to parse preset from URL:', error);
    return null;
  }
}

/**
 * Check if current URL contains a shared preset and return it
 */
export function checkUrlForSharedPreset(): { name: string; description?: string; models: string[] } | null {
  return parsePresetFromUrl(window.location.href);
}

/**
 * Preset templates for common use cases
 */
export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  category: 'support' | 'writing' | 'brainstorm' | 'analysis' | 'development';
  suggestedModels: string[];
  systemPrompt?: string;
}

export const PRESET_TEMPLATES: PresetTemplate[] = [
  // Customer Support Templates
  {
    id: 'template-support-friendly',
    name: 'Friendly Support Agent',
    description: 'Warm, empathetic responses for customer inquiries',
    category: 'support',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022', 'gemini-1.5-pro'],
    systemPrompt: 'You are a friendly and empathetic customer support agent. Be warm, understanding, and helpful.',
  },
  {
    id: 'template-support-technical',
    name: 'Technical Support Specialist',
    description: 'Detailed technical troubleshooting and solutions',
    category: 'support',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022', 'deepseek-chat'],
    systemPrompt: 'You are a technical support specialist. Provide clear, step-by-step troubleshooting guidance.',
  },
  
  // Technical Writing Templates
  {
    id: 'template-writing-docs',
    name: 'Documentation Writer',
    description: 'Clear, structured technical documentation',
    category: 'writing',
    suggestedModels: ['claude-3-5-sonnet-20241022', 'gpt-4o', 'gemini-1.5-pro'],
    systemPrompt: 'You are a technical writer. Create clear, well-structured documentation with examples.',
  },
  {
    id: 'template-writing-blog',
    name: 'Blog Post Creator',
    description: 'Engaging blog posts with SEO optimization',
    category: 'writing',
    suggestedModels: ['claude-3-5-sonnet-20241022', 'gpt-4o', 'gemini-1.5-flash'],
    systemPrompt: 'You are a professional blog writer. Create engaging, SEO-friendly content.',
  },
  {
    id: 'template-writing-email',
    name: 'Professional Email Writer',
    description: 'Polished business emails and correspondence',
    category: 'writing',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022'],
    systemPrompt: 'You are a professional communication specialist. Write clear, polished business emails.',
  },
  
  // Brainstorming Templates
  {
    id: 'template-brainstorm-ideas',
    name: 'Creative Ideation',
    description: 'Generate diverse creative ideas and concepts',
    category: 'brainstorm',
    suggestedModels: ['claude-3-5-sonnet-20241022', 'gpt-4o', 'gemini-1.5-pro'],
    systemPrompt: 'You are a creative consultant. Generate diverse, innovative ideas without self-censoring.',
  },
  {
    id: 'template-brainstorm-problem',
    name: 'Problem Solver',
    description: 'Analyze problems from multiple angles',
    category: 'brainstorm',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022', 'deepseek-chat'],
    systemPrompt: 'You are a strategic problem solver. Analyze issues from multiple perspectives and suggest solutions.',
  },
  {
    id: 'template-brainstorm-critique',
    name: 'Devil\'s Advocate',
    description: 'Challenge assumptions and find weaknesses',
    category: 'brainstorm',
    suggestedModels: ['claude-3-5-sonnet-20241022', 'gpt-4o'],
    systemPrompt: 'You are a critical thinker. Challenge assumptions, find weaknesses, and suggest improvements.',
  },
  
  // Analysis Templates
  {
    id: 'template-analysis-data',
    name: 'Data Analyst',
    description: 'Interpret data and extract insights',
    category: 'analysis',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022', 'deepseek-chat'],
    systemPrompt: 'You are a data analyst. Interpret data, identify patterns, and provide actionable insights.',
  },
  {
    id: 'template-analysis-research',
    name: 'Research Assistant',
    description: 'Comprehensive research and summarization',
    category: 'analysis',
    suggestedModels: ['claude-3-5-sonnet-20241022', 'gpt-4o', 'gemini-1.5-pro'],
    systemPrompt: 'You are a research assistant. Provide thorough, well-sourced information and summaries.',
  },
  
  // Development Templates
  {
    id: 'template-dev-code-review',
    name: 'Code Reviewer',
    description: 'Review code for bugs, style, and best practices',
    category: 'development',
    suggestedModels: ['claude-3-5-sonnet-20241022', 'gpt-4o', 'deepseek-coder'],
    systemPrompt: 'You are a senior code reviewer. Identify bugs, suggest improvements, and enforce best practices.',
  },
  {
    id: 'template-dev-architect',
    name: 'System Architect',
    description: 'Design scalable system architectures',
    category: 'development',
    suggestedModels: ['claude-3-5-sonnet-20241022', 'gpt-4o', 'deepseek-chat'],
    systemPrompt: 'You are a system architect. Design scalable, maintainable architectures with clear explanations.',
  },
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: PresetTemplate['category']): PresetTemplate[] {
  return PRESET_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get all template categories
 */
export function getTemplateCategories(): { id: PresetTemplate['category']; name: string; count: number }[] {
  const categories: { id: PresetTemplate['category']; name: string }[] = [
    { id: 'support', name: 'Customer Support' },
    { id: 'writing', name: 'Technical Writing' },
    { id: 'brainstorm', name: 'Brainstorming' },
    { id: 'analysis', name: 'Analysis' },
    { id: 'development', name: 'Development' },
  ];
  
  return categories.map(cat => ({
    ...cat,
    count: PRESET_TEMPLATES.filter(t => t.category === cat.id).length,
  }));
}

/**
 * Create a QuickPreset from a template
 */
export function createPresetFromTemplate(template: PresetTemplate): QuickPreset {
  return {
    id: `quick-${Date.now()}-${Math.random()}`,
    sourceId: template.id,
    sourceType: 'custom',
    name: template.name,
    description: template.description,
    models: [...template.suggestedModels],
    isModified: false,
    isFavorite: false,
    usageCount: 0,
  };
}
