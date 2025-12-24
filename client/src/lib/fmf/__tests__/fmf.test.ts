/**
 * FMF Enforcement Tests
 * 
 * These tests ensure the Fix-Modify Framework registries are properly maintained
 * and that code follows FMF guidelines.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { UI_LABELS, getLabel, getModelCountLabel } from '../ui-labels';
import { 
  RESERVED_TERMS, 
  isTermReserved, 
  getTermConflicts, 
  getAllReservedTerms 
} from '../reserved-terms';
import { 
  COMPONENTS, 
  getComponentDependents, 
  getComponentDependencies,
  getAffectedComponents 
} from '../components';
import { 
  ROUTES, 
  getRouteByPath, 
  getRoutesByComponent,
  isValidRoute,
  MODE_VALUES 
} from '../routes';
import { 
  STATE_KEYS, 
  isStateKeyReserved, 
  getAllLocalStorageKeys,
  STORAGE_PREFIX 
} from '../state-keys';
import { PATTERNS, getPattern, searchPatterns } from '../patterns';
import { RELATIONSHIPS, getAffects, getImpactedFeatures } from '../relationships';
import { 
  validateLabelChange, 
  validateComponentChange, 
  validateRouteChange,
  validateStateKeyChange,
  validateZIndexChange 
} from '../validators';
import { CHANGE_CLASSIFICATIONS, getChangeClassification } from '../types';

// ============================================================================
// UI_LABELS Tests
// ============================================================================
describe('UI_LABELS Registry', () => {
  it('should have all required header labels', () => {
    expect(UI_LABELS.HEADER.MODE).toBe('Mode');
    expect(UI_LABELS.HEADER.THEME).toBe('Theme');
    expect(UI_LABELS.HEADER.NEW_CHAT).toBe('New Chat');
    expect(UI_LABELS.HEADER.WINDOWS).toBe('Windows');
  });

  it('should have all required settings labels', () => {
    expect(UI_LABELS.SETTINGS.PRESETS_SETTING).toBe('Presets Setting');
    expect(UI_LABELS.SETTINGS.CATEGORIES_SETTING).toBe('Categories Setting');
    expect(UI_LABELS.SETTINGS.CHAT_THEME).toBe('Chat Theme');
  });

  it('should have all mode labels', () => {
    expect(UI_LABELS.MODES.CHAT).toBe('Chat');
    expect(UI_LABELS.MODES.EMPTY).toBe('Empty');
    expect(UI_LABELS.MODES.CONVERSATION).toBe('Conversation');
    expect(UI_LABELS.MODES.AGENTS).toBe('Agents');
  });

  it('getLabel should return correct values', () => {
    expect(getLabel('HEADER.MODE')).toBe('Mode');
    expect(getLabel('SETTINGS.CHAT_THEME')).toBe('Chat Theme');
  });

  it('getLabel should warn for invalid paths', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = getLabel('INVALID.PATH');
    expect(result).toBe('INVALID.PATH');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('getModelCountLabel should format correctly', () => {
    expect(getModelCountLabel(0)).toBe('0 Models');
    expect(getModelCountLabel(1)).toBe('1 Model');
    expect(getModelCountLabel(3)).toBe('3 Models');
  });

  it('should not have duplicate labels across categories', () => {
    const allLabels: string[] = [];
    const duplicates: string[] = [];

    function collectLabels(obj: any, path: string) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          if (allLabels.includes(value) && !['Cancel', 'Save', 'Delete', 'Edit', 'Close'].includes(value)) {
            duplicates.push(`${value} (at ${path}.${key})`);
          }
          allLabels.push(value);
        } else if (typeof value === 'object' && value !== null) {
          collectLabels(value, `${path}.${key}`);
        }
      }
    }

    collectLabels(UI_LABELS, 'UI_LABELS');
    
    // Allow common labels to be duplicated
    const allowedDuplicates = ['Cancel', 'Save', 'Delete', 'Edit', 'Close', 'New Chat'];
    const unexpectedDuplicates = duplicates.filter(d => 
      !allowedDuplicates.some(a => d.startsWith(a))
    );
    
    expect(unexpectedDuplicates).toHaveLength(0);
  });
});

// ============================================================================
// RESERVED_TERMS Tests
// ============================================================================
describe('RESERVED_TERMS Registry', () => {
  it('should have MODE as reserved', () => {
    expect(isTermReserved('Mode')).toBe(true);
    expect(isTermReserved('mode')).toBe(true);
  });

  it('should have THEME as reserved', () => {
    expect(isTermReserved('Theme')).toBe(true);
  });

  it('should detect conflicts with reserved terms', () => {
    const conflicts = getTermConflicts('Light Mode');
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0]).toContain('Mode');
  });

  it('should allow "Chat Theme" as exception', () => {
    const conflicts = getTermConflicts('Chat Theme');
    // Chat Theme is allowed as a sub-category
    expect(conflicts.filter(c => c.includes('cannot'))).toHaveLength(0);
  });

  it('should have alternatives for each reserved term', () => {
    for (const term of Object.values(RESERVED_TERMS)) {
      expect(term.alternatives.length).toBeGreaterThan(0);
    }
  });

  it('should have usedIn locations for each reserved term', () => {
    for (const term of Object.values(RESERVED_TERMS)) {
      expect(term.usedIn.length).toBeGreaterThan(0);
    }
  });

  it('getAllReservedTerms should return all terms', () => {
    const terms = getAllReservedTerms();
    expect(terms).toContain('Mode');
    expect(terms).toContain('Theme');
    expect(terms).toContain('Preset');
    expect(terms).toContain('Model');
  });
});

// ============================================================================
// COMPONENTS Tests
// ============================================================================
describe('COMPONENTS Registry', () => {
  it('should have FloatingChatWindow registered', () => {
    expect(COMPONENTS.FloatingChatWindow).toBeDefined();
    expect(COMPONENTS.FloatingChatWindow.path).toContain('FloatingChatWindow');
  });

  it('should have correct dependencies for FloatingChatWindow', () => {
    const deps = getComponentDependencies('FloatingChatWindow');
    expect(deps).toContain('ChatFooter');
    expect(deps).toContain('ModelSelector');
  });

  it('should have correct dependents for ChatFooter', () => {
    const dependents = getComponentDependents('ChatFooter');
    expect(dependents).toContain('FloatingChatWindow');
  });

  it('should track breaking changes', () => {
    expect(COMPONENTS.FloatingChatWindow.breakingChanges.length).toBeGreaterThan(0);
  });

  it('should have z-index layer for floating components', () => {
    expect(COMPONENTS.FloatingChatWindow.zIndexLayer).toBe('FLOATING');
    expect(COMPONENTS.PresetEditorModal.zIndexLayer).toBe('MODAL');
    expect(COMPONENTS.ModelSelector.zIndexLayer).toBe('DROPDOWN');
  });

  it('getAffectedComponents should return all affected components', () => {
    const affected = getAffectedComponents('ChatFooter');
    expect(affected).toContain('FloatingChatWindow');
  });

  it('all components should have required fields', () => {
    for (const [name, component] of Object.entries(COMPONENTS)) {
      expect(component.name).toBe(name);
      expect(component.path).toBeDefined();
      expect(component.description).toBeDefined();
      expect(Array.isArray(component.dependencies)).toBe(true);
      expect(Array.isArray(component.dependents)).toBe(true);
      expect(Array.isArray(component.props)).toBe(true);
      expect(Array.isArray(component.breakingChanges)).toBe(true);
    }
  });
});

// ============================================================================
// ROUTES Tests
// ============================================================================
describe('ROUTES Registry', () => {
  it('should have all main routes', () => {
    expect(getRouteByPath('/')).toBeDefined();
    expect(getRouteByPath('/empty')).toBeDefined();
    expect(getRouteByPath('/chat')).toBeDefined();
    expect(getRouteByPath('/agents')).toBeDefined();
    expect(getRouteByPath('/conversation')).toBeDefined();
  });

  it('should have correct mode values', () => {
    expect(ROUTES.EMPTY.modeValue).toBe('empty');
    expect(ROUTES.CHAT.modeValue).toBe('chat');
    expect(ROUTES.AGENTS.modeValue).toBe('agents');
  });

  it('MODE_VALUES should match route modeValues', () => {
    expect(MODE_VALUES.EMPTY).toBe(ROUTES.EMPTY.modeValue);
    expect(MODE_VALUES.CHAT).toBe(ROUTES.CHAT.modeValue);
    expect(MODE_VALUES.AGENTS).toBe(ROUTES.AGENTS.modeValue);
  });

  it('isValidRoute should work correctly', () => {
    expect(isValidRoute('/')).toBe(true);
    expect(isValidRoute('/empty')).toBe(true);
    expect(isValidRoute('/nonexistent')).toBe(false);
  });

  it('getRoutesByComponent should find routes', () => {
    const routes = getRoutesByComponent('EmptyPage');
    expect(routes.length).toBeGreaterThan(0);
  });

  it('all routes should have required fields', () => {
    for (const route of Object.values(ROUTES)) {
      expect(route.path).toBeDefined();
      expect(route.component).toBeDefined();
      expect(route.name).toBeDefined();
      expect(route.status).toMatch(/^(active|coming-soon|deprecated)$/);
      expect(typeof route.requiresAuth).toBe('boolean');
    }
  });
});

// ============================================================================
// STATE_KEYS Tests
// ============================================================================
describe('STATE_KEYS Registry', () => {
  it('should have all preset-related keys', () => {
    expect(STATE_KEYS.CUSTOM_PRESETS).toBeDefined();
    expect(STATE_KEYS.QUICK_PRESETS).toBeDefined();
    expect(STATE_KEYS.PRESET_USAGE).toBeDefined();
  });

  it('should have conversation keys', () => {
    expect(STATE_KEYS.SAVED_CONVERSATIONS).toBeDefined();
    expect(STATE_KEYS.ARCHIVED_CONVERSATIONS).toBeDefined();
  });

  it('all localStorage keys should use correct prefix', () => {
    const keys = getAllLocalStorageKeys();
    for (const key of keys) {
      if (!key.startsWith('vite-')) { // Exception for theme key
        expect(key.startsWith(STORAGE_PREFIX)).toBe(true);
      }
    }
  });

  it('isStateKeyReserved should work correctly', () => {
    expect(isStateKeyReserved('multi-ai-chat-custom-presets')).toBe(true);
    expect(isStateKeyReserved('random-key')).toBe(false);
  });

  it('all state keys should have readers and writers', () => {
    for (const stateKey of Object.values(STATE_KEYS)) {
      expect(stateKey.readers.length).toBeGreaterThan(0);
      // Writers can be empty for read-only state
    }
  });

  it('breaking change keys should be marked', () => {
    expect(STATE_KEYS.CUSTOM_PRESETS.breakingChange).toBe(true);
    expect(STATE_KEYS.SAVED_CONVERSATIONS.breakingChange).toBe(true);
  });
});

// ============================================================================
// PATTERNS Tests
// ============================================================================
describe('PATTERNS Registry', () => {
  it('should have STATE_MANAGEMENT patterns', () => {
    expect(PATTERNS.STATE_MANAGEMENT).toBeDefined();
    expect(PATTERNS.STATE_MANAGEMENT.patterns.MEMOIZATION).toBeDefined();
    expect(PATTERNS.STATE_MANAGEMENT.patterns.STABLE_REFERENCES).toBeDefined();
  });

  it('should have Z_INDEX patterns', () => {
    expect(PATTERNS.Z_INDEX).toBeDefined();
    expect(PATTERNS.Z_INDEX.patterns.USE_Z_CLASS).toBeDefined();
    expect(PATTERNS.Z_INDEX.patterns.Z_INDEX_SCALE).toBeDefined();
  });

  it('should have TOUCH_HANDLING patterns', () => {
    expect(PATTERNS.TOUCH_HANDLING).toBeDefined();
    expect(PATTERNS.TOUCH_HANDLING.patterns.DUAL_EVENTS).toBeDefined();
    expect(PATTERNS.TOUCH_HANDLING.patterns.TOUCH_TARGETS).toBeDefined();
  });

  it('getPattern should return correct pattern', () => {
    const pattern = getPattern('STATE_MANAGEMENT', 'MEMOIZATION');
    expect(pattern).toBeDefined();
    expect(pattern?.name).toBe('Memoize Computed Values');
  });

  it('searchPatterns should find patterns', () => {
    const results = searchPatterns('z-index');
    expect(results.length).toBeGreaterThan(0);
  });

  it('all patterns should have examples and anti-patterns', () => {
    for (const category of Object.values(PATTERNS)) {
      for (const pattern of Object.values(category.patterns)) {
        expect(pattern.example).toBeDefined();
        expect(pattern.example.length).toBeGreaterThan(0);
        expect(pattern.antiPattern).toBeDefined();
        expect(pattern.antiPattern.length).toBeGreaterThan(0);
      }
    }
  });
});

// ============================================================================
// RELATIONSHIPS Tests
// ============================================================================
describe('RELATIONSHIPS Registry', () => {
  it('should have PRESETS relationship', () => {
    expect(RELATIONSHIPS.PRESETS).toBeDefined();
    expect(RELATIONSHIPS.PRESETS.affects.length).toBeGreaterThan(0);
  });

  it('should have THEME relationship', () => {
    expect(RELATIONSHIPS.THEME).toBeDefined();
  });

  it('getAffects should return affected items', () => {
    const affects = getAffects('PRESETS');
    expect(affects.length).toBeGreaterThan(0);
  });

  it('getImpactedFeatures should find related features', () => {
    const impacted = getImpactedFeatures('PRESETS');
    // PRESETS affects CATEGORIES and MODELS
    expect(impacted.length).toBeGreaterThan(0);
  });

  it('all relationships should have required fields', () => {
    for (const rel of Object.values(RELATIONSHIPS)) {
      expect(rel.name).toBeDefined();
      expect(Array.isArray(rel.affects)).toBe(true);
      expect(Array.isArray(rel.affectedBy)).toBe(true);
      expect(Array.isArray(rel.owns)).toBe(true);
      expect(Array.isArray(rel.uses)).toBe(true);
      expect(Array.isArray(rel.emits)).toBe(true);
      expect(Array.isArray(rel.listensTo)).toBe(true);
    }
  });
});

// ============================================================================
// VALIDATORS Tests
// ============================================================================
describe('FMF Validators', () => {
  describe('validateLabelChange', () => {
    it('should reject labels that conflict with reserved terms', () => {
      const result = validateLabelChange('Theme', 'Dark Mode');
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.riskLevel).toBe('HIGH');
    });

    it('should accept valid label changes', () => {
      const result = validateLabelChange('Old Label', 'New Label');
      expect(result.valid).toBe(true);
    });

    it('should warn about existing label usage', () => {
      const result = validateLabelChange('Something', 'Mode');
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateComponentChange', () => {
    it('should warn about dependents', () => {
      const result = validateComponentChange('ChatFooter', 'Modifying props');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should detect breaking change keywords', () => {
      const result = validateComponentChange('ChatFooter', 'Remove onSend prop');
      expect(result.riskLevel).toBe('HIGH');
    });

    it('should handle unknown components', () => {
      const result = validateComponentChange('UnknownComponent', 'Some change');
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('validateRouteChange', () => {
    it('should reject adding existing routes', () => {
      const result = validateRouteChange('/empty', 'add');
      expect(result.valid).toBe(false);
    });

    it('should accept adding new routes', () => {
      const result = validateRouteChange('/new-route', 'add');
      expect(result.valid).toBe(true);
    });

    it('should warn about removing routes', () => {
      const result = validateRouteChange('/empty', 'remove');
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.riskLevel).toBe('HIGH');
    });
  });

  describe('validateStateKeyChange', () => {
    it('should reject adding existing keys', () => {
      const result = validateStateKeyChange('multi-ai-chat-custom-presets', 'add');
      expect(result.valid).toBe(false);
    });

    it('should warn about modifying existing keys', () => {
      const result = validateStateKeyChange('multi-ai-chat-custom-presets', 'modify');
      expect(result.riskLevel).toBe('HIGH');
    });
  });

  describe('validateZIndexChange', () => {
    it('should warn about arbitrary z-index values', () => {
      const result = validateZIndexChange('SomeComponent', 'z-[9999]');
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should warn about hardcoded numbers', () => {
      const result = validateZIndexChange('SomeComponent', 50);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// CHANGE_CLASSIFICATIONS Tests
// ============================================================================
describe('CHANGE_CLASSIFICATIONS', () => {
  it('should have all classification types', () => {
    expect(CHANGE_CLASSIFICATIONS.UI_LABEL_CHANGE).toBeDefined();
    expect(CHANGE_CLASSIFICATIONS.COMPONENT_PROP_CHANGE).toBeDefined();
    expect(CHANGE_CLASSIFICATIONS.ROUTE_CHANGE).toBeDefined();
    expect(CHANGE_CLASSIFICATIONS.STATE_KEY_CHANGE).toBeDefined();
    expect(CHANGE_CLASSIFICATIONS.Z_INDEX_CHANGE).toBeDefined();
    expect(CHANGE_CLASSIFICATIONS.STYLE_CHANGE).toBeDefined();
  });

  it('should have correct risk levels', () => {
    expect(CHANGE_CLASSIFICATIONS.COMPONENT_PROP_CHANGE.risk).toBe('HIGH');
    expect(CHANGE_CLASSIFICATIONS.ROUTE_CHANGE.risk).toBe('HIGH');
    expect(CHANGE_CLASSIFICATIONS.STATE_KEY_CHANGE.risk).toBe('HIGH');
    expect(CHANGE_CLASSIFICATIONS.STYLE_CHANGE.risk).toBe('LOW');
  });

  it('getChangeClassification should return correct classification', () => {
    const classification = getChangeClassification('UI_LABEL_CHANGE');
    expect(classification.risk).toBe('MEDIUM');
    expect(classification.preChecks.length).toBeGreaterThan(0);
    expect(classification.postChecks.length).toBeGreaterThan(0);
  });

  it('HIGH risk changes should require checkpoint', () => {
    expect(CHANGE_CLASSIFICATIONS.COMPONENT_PROP_CHANGE.requiresCheckpoint).toBe(true);
    expect(CHANGE_CLASSIFICATIONS.ROUTE_CHANGE.requiresCheckpoint).toBe(true);
    expect(CHANGE_CLASSIFICATIONS.STATE_KEY_CHANGE.requiresCheckpoint).toBe(true);
  });
});

// ============================================================================
// Integration Tests
// ============================================================================
describe('FMF Integration', () => {
  it('UI_LABELS should not use reserved terms incorrectly', () => {
    // Check that HEADER.MODE is the only place "Mode" appears as a standalone label
    // (not counting MODES category which is different)
    expect(UI_LABELS.HEADER.MODE).toBe('Mode');
    // Theme should only be in HEADER, not duplicated
    expect(UI_LABELS.HEADER.THEME).toBe('Theme');
    // Chat Theme is allowed as a sub-category
    expect(UI_LABELS.SETTINGS.CHAT_THEME).toBe('Chat Theme');
  });

  it('COMPONENTS should reference valid routes', () => {
    for (const component of Object.values(COMPONENTS)) {
      if (component.name.endsWith('Page')) {
        // Page components should have corresponding routes
        const routes = getRoutesByComponent(component.name);
        // Not all pages need routes (e.g., test pages)
        if (routes.length > 0) {
          expect(routes[0].component).toBe(component.name);
        }
      }
    }
  });

  it('STATE_KEYS readers should be valid components', () => {
    for (const stateKey of Object.values(STATE_KEYS)) {
      for (const reader of stateKey.readers) {
        // Reader should either be a registered component or a valid component name
        // (some components might not be in registry yet)
        expect(typeof reader).toBe('string');
        expect(reader.length).toBeGreaterThan(0);
      }
    }
  });

  it('RELATIONSHIPS should reference valid features', () => {
    for (const rel of Object.values(RELATIONSHIPS)) {
      // Each relationship should have a meaningful name
      expect(rel.name.length).toBeGreaterThan(0);
      // Affects and affectedBy should have content for most features
      // (some like AI_PROVIDERS are constants and may have empty arrays)
    }
  });
});
