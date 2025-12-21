import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  QuickPreset,
  addQuickPresets,
  updateQuickPreset,
  removeQuickPreset,
  reorderQuickPresets,
  toggleFavorite,
  sortByFavorite,
  exportPresets,
  importPresets,
} from '@/lib/quick-presets';

describe('Quick Presets', () => {
  let mockPresets: QuickPreset[];

  beforeEach(() => {
    mockPresets = [
      {
        id: 'preset-1',
        sourceId: 'coding',
        sourceType: 'built-in',
        name: 'Coding Team',
        description: 'Best for code generation',
        models: ['openai:GPT-4', 'deepseek:DeepSeek Coder'],
        isModified: false,
        isFavorite: false,
      },
      {
        id: 'preset-2',
        sourceId: 'general',
        sourceType: 'built-in',
        name: 'General Purpose',
        description: 'Versatile team for everyday tasks',
        models: ['openai:GPT-4', 'anthropic:Claude 3 Sonnet'],
        isModified: false,
        isFavorite: true,
      },
      {
        id: 'preset-3',
        sourceId: 'custom-1',
        sourceType: 'custom',
        name: 'My Custom Preset',
        models: ['openai:GPT-4'],
        isModified: false,
        isFavorite: false,
      },
    ];
  });

  describe('addQuickPresets', () => {
    it('should add new presets to the list', () => {
      const newPresets = [
        {
          sourceId: 'research',
          sourceType: 'built-in' as const,
          name: 'Research Squad',
          description: 'Optimized for fact-finding',
          models: ['perplexity:Perplexity Pro'],
        },
      ];

      const result = addQuickPresets(mockPresets, newPresets);

      expect(result).toHaveLength(4);
      expect(result[3].name).toBe('Research Squad');
      expect(result[3].description).toBe('Optimized for fact-finding');
      expect(result[3].isFavorite).toBe(false);
      expect(result[3].isModified).toBe(false);
    });

    it('should generate unique IDs for new presets', () => {
      const newPresets = [
        {
          sourceId: 'test-1',
          sourceType: 'custom' as const,
          name: 'Test 1',
          models: [],
        },
        {
          sourceId: 'test-2',
          sourceType: 'custom' as const,
          name: 'Test 2',
          models: [],
        },
      ];

      const result = addQuickPresets([], newPresets);

      expect(result[0].id).not.toBe(result[1].id);
      expect(result[0].id).toContain('quick-');
    });
  });

  describe('updateQuickPreset', () => {
    it('should update preset name', () => {
      const result = updateQuickPreset(mockPresets, 'preset-1', {
        name: 'Updated Coding Team',
      });

      expect(result[0].name).toBe('Updated Coding Team');
      expect(result[0].isModified).toBe(true);
    });

    it('should update preset models', () => {
      const result = updateQuickPreset(mockPresets, 'preset-1', {
        models: ['openai:GPT-4'],
      });

      expect(result[0].models).toHaveLength(1);
      expect(result[0].isModified).toBe(true);
    });

    it('should update isFavorite status', () => {
      const result = updateQuickPreset(mockPresets, 'preset-1', {
        isFavorite: true,
      });

      expect(result[0].isFavorite).toBe(true);
    });

    it('should not modify other presets', () => {
      const result = updateQuickPreset(mockPresets, 'preset-1', {
        name: 'Updated',
      });

      expect(result[1].name).toBe('General Purpose');
      expect(result[2].name).toBe('My Custom Preset');
    });
  });

  describe('removeQuickPreset', () => {
    it('should remove preset by ID', () => {
      const result = removeQuickPreset(mockPresets, 'preset-2');

      expect(result).toHaveLength(2);
      expect(result.find(p => p.id === 'preset-2')).toBeUndefined();
    });

    it('should not modify array if ID not found', () => {
      const result = removeQuickPreset(mockPresets, 'non-existent');

      expect(result).toHaveLength(3);
    });
  });

  describe('reorderQuickPresets', () => {
    it('should move preset from start to end', () => {
      const result = reorderQuickPresets(mockPresets, 0, 2);

      expect(result[0].id).toBe('preset-2');
      expect(result[1].id).toBe('preset-3');
      expect(result[2].id).toBe('preset-1');
    });

    it('should move preset from end to start', () => {
      const result = reorderQuickPresets(mockPresets, 2, 0);

      expect(result[0].id).toBe('preset-3');
      expect(result[1].id).toBe('preset-1');
      expect(result[2].id).toBe('preset-2');
    });

    it('should handle same index (no change)', () => {
      const result = reorderQuickPresets(mockPresets, 1, 1);

      expect(result[0].id).toBe('preset-1');
      expect(result[1].id).toBe('preset-2');
      expect(result[2].id).toBe('preset-3');
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite from false to true', () => {
      const result = toggleFavorite(mockPresets, 'preset-1');

      expect(result[0].isFavorite).toBe(true);
    });

    it('should toggle favorite from true to false', () => {
      const result = toggleFavorite(mockPresets, 'preset-2');

      expect(result[1].isFavorite).toBe(false);
    });

    it('should not modify other presets', () => {
      const result = toggleFavorite(mockPresets, 'preset-1');

      expect(result[1].isFavorite).toBe(true); // unchanged
      expect(result[2].isFavorite).toBe(false); // unchanged
    });
  });

  describe('sortByFavorite', () => {
    it('should sort favorites to the top', () => {
      const result = sortByFavorite(mockPresets);

      expect(result[0].isFavorite).toBe(true);
      expect(result[0].id).toBe('preset-2');
    });

    it('should preserve relative order of non-favorites', () => {
      const result = sortByFavorite(mockPresets);

      const nonFavorites = result.filter(p => !p.isFavorite);
      expect(nonFavorites[0].id).toBe('preset-1');
      expect(nonFavorites[1].id).toBe('preset-3');
    });

    it('should not modify original array', () => {
      const original = [...mockPresets];
      sortByFavorite(mockPresets);

      expect(mockPresets[0].id).toBe(original[0].id);
    });
  });

  describe('exportPresets', () => {
    it('should export presets to JSON string', () => {
      const json = exportPresets(mockPresets);
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe(1);
      expect(parsed.exportedAt).toBeDefined();
      expect(parsed.presets).toHaveLength(3);
    });

    it('should include all preset properties', () => {
      const json = exportPresets([mockPresets[0]]);
      const parsed = JSON.parse(json);

      expect(parsed.presets[0].name).toBe('Coding Team');
      expect(parsed.presets[0].description).toBe('Best for code generation');
      expect(parsed.presets[0].models).toEqual(['openai:GPT-4', 'deepseek:DeepSeek Coder']);
      expect(parsed.presets[0].sourceType).toBe('built-in');
      expect(parsed.presets[0].sourceId).toBe('coding');
      expect(parsed.presets[0].isFavorite).toBe(false);
    });

    it('should not include internal ID', () => {
      const json = exportPresets(mockPresets);
      const parsed = JSON.parse(json);

      expect(parsed.presets[0].id).toBeUndefined();
    });
  });

  describe('importPresets', () => {
    it('should import valid JSON', () => {
      const exportedJson = exportPresets(mockPresets);
      const imported = importPresets(exportedJson);

      expect(imported).not.toBeNull();
      expect(imported).toHaveLength(3);
    });

    it('should generate new IDs for imported presets', () => {
      const exportedJson = exportPresets(mockPresets);
      const imported = importPresets(exportedJson);

      expect(imported![0].id).not.toBe('preset-1');
      expect(imported![0].id).toContain('quick-');
    });

    it('should preserve preset data', () => {
      const exportedJson = exportPresets([mockPresets[0]]);
      const imported = importPresets(exportedJson);

      expect(imported![0].name).toBe('Coding Team');
      expect(imported![0].description).toBe('Best for code generation');
      expect(imported![0].models).toEqual(['openai:GPT-4', 'deepseek:DeepSeek Coder']);
    });

    it('should return null for invalid JSON', () => {
      const result = importPresets('invalid json');

      expect(result).toBeNull();
    });

    it('should return null for JSON without presets array', () => {
      const result = importPresets('{"version": 1}');

      expect(result).toBeNull();
    });

    it('should handle missing optional fields', () => {
      const minimalJson = JSON.stringify({
        version: 1,
        presets: [{ name: 'Test', models: ['model-1'] }],
      });

      const imported = importPresets(minimalJson);

      expect(imported).not.toBeNull();
      expect(imported![0].name).toBe('Test');
      expect(imported![0].sourceType).toBe('custom');
      expect(imported![0].isFavorite).toBe(false);
    });
  });
});
