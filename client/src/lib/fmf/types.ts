/**
 * FMF Types - Type definitions for the Fix-Modify Framework
 */

/**
 * Risk levels for changes
 */
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * Change classification
 */
export interface ChangeClassification {
  /** Risk level of the change */
  risk: RiskLevel;
  /** Description of the change */
  description: string;
  /** What needs to be checked before making this change */
  preChecks: string[];
  /** What needs to be verified after making this change */
  postChecks: string[];
  /** Whether this change requires a checkpoint before proceeding */
  requiresCheckpoint: boolean;
  /** Whether this change requires tests to be updated */
  requiresTestUpdate: boolean;
}

/**
 * FMF Registry - Combined registry type
 */
export interface FMFRegistry {
  /** UI Labels registry */
  uiLabels: typeof import('./ui-labels').UI_LABELS;
  /** Reserved Terms registry */
  reservedTerms: typeof import('./reserved-terms').RESERVED_TERMS;
  /** Components registry */
  components: typeof import('./components').COMPONENTS;
  /** Routes registry */
  routes: typeof import('./routes').ROUTES;
  /** State Keys registry */
  stateKeys: typeof import('./state-keys').STATE_KEYS;
  /** Patterns registry */
  patterns: typeof import('./patterns').PATTERNS;
  /** Relationships registry */
  relationships: typeof import('./relationships').RELATIONSHIPS;
}

/**
 * Change types that the FMF tracks
 */
export type ChangeType = 
  | 'ui-label'
  | 'reserved-term'
  | 'component'
  | 'route'
  | 'state-key'
  | 'pattern'
  | 'relationship';

/**
 * Validation result from FMF validators
 */
export interface ValidationResult {
  /** Whether the validation passed */
  valid: boolean;
  /** Error messages if validation failed */
  errors: string[];
  /** Warning messages (non-blocking) */
  warnings: string[];
  /** Suggestions for improvement */
  suggestions: string[];
  /** Risk level of the proposed change */
  riskLevel: RiskLevel;
}

/**
 * FMF Checklist item
 */
export interface ChecklistItem {
  /** Step number */
  step: number;
  /** Step name */
  name: string;
  /** Step description */
  description: string;
  /** Whether this step is completed */
  completed: boolean;
  /** Notes from completing this step */
  notes?: string;
}

/**
 * FMF Checklist for a change
 */
export interface FMFChecklist {
  /** The change being made */
  change: string;
  /** Classification of the change */
  classification: ChangeClassification;
  /** Checklist items */
  items: ChecklistItem[];
  /** Overall status */
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  /** Blocking issues if status is blocked */
  blockingIssues?: string[];
}

/**
 * Pre-defined change classifications
 */
export const CHANGE_CLASSIFICATIONS: Record<string, ChangeClassification> = {
  UI_LABEL_CHANGE: {
    risk: 'MEDIUM',
    description: 'Changing user-facing text',
    preChecks: [
      'Check UI_LABELS registry for existing label',
      'Check RESERVED_TERMS for conflicts',
      'Search codebase for hardcoded instances',
    ],
    postChecks: [
      'Verify label appears correctly in all locations',
      'Check for truncation on mobile',
      'Verify translations if applicable',
    ],
    requiresCheckpoint: true,
    requiresTestUpdate: false,
  },

  COMPONENT_PROP_CHANGE: {
    risk: 'HIGH',
    description: 'Changing component props',
    preChecks: [
      'Check COMPONENTS registry for dependents',
      'Review all usages of the component',
      'Check for breaking changes',
    ],
    postChecks: [
      'Verify all dependents still work',
      'Run component tests',
      'Check TypeScript errors',
    ],
    requiresCheckpoint: true,
    requiresTestUpdate: true,
  },

  ROUTE_CHANGE: {
    risk: 'HIGH',
    description: 'Adding or modifying routes',
    preChecks: [
      'Check ROUTES registry for conflicts',
      'Verify component exists',
      'Check navigation logic',
    ],
    postChecks: [
      'Test navigation from all entry points',
      'Verify deep linking works',
      'Check browser back/forward',
    ],
    requiresCheckpoint: true,
    requiresTestUpdate: true,
  },

  STATE_KEY_CHANGE: {
    risk: 'HIGH',
    description: 'Changing localStorage keys or state structure',
    preChecks: [
      'Check STATE_KEYS registry',
      'Plan migration for existing data',
      'Identify all readers/writers',
    ],
    postChecks: [
      'Verify data persistence',
      'Test with existing localStorage data',
      'Check cross-tab sync if applicable',
    ],
    requiresCheckpoint: true,
    requiresTestUpdate: true,
  },

  Z_INDEX_CHANGE: {
    risk: 'MEDIUM',
    description: 'Changing z-index values',
    preChecks: [
      'Check Z_INDEX scale in z-index.ts',
      'Identify affected layers',
      'Review component stacking',
    ],
    postChecks: [
      'Test all modal/dropdown combinations',
      'Verify on mobile',
      'Check floating window layering',
    ],
    requiresCheckpoint: true,
    requiresTestUpdate: false,
  },

  STYLE_CHANGE: {
    risk: 'LOW',
    description: 'Changing CSS/Tailwind classes',
    preChecks: [
      'Check for theme compatibility',
      'Verify responsive breakpoints',
    ],
    postChecks: [
      'Visual inspection on desktop',
      'Visual inspection on mobile',
      'Check dark/light mode',
    ],
    requiresCheckpoint: false,
    requiresTestUpdate: false,
  },
};

/**
 * Get the classification for a change type
 * @param changeType The type of change
 * @returns The change classification
 */
export function getChangeClassification(changeType: keyof typeof CHANGE_CLASSIFICATIONS): ChangeClassification {
  return CHANGE_CLASSIFICATIONS[changeType];
}
