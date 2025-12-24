/**
 * FMF Validators - Validation functions for the Fix-Modify Framework
 * 
 * These validators check proposed changes against the FMF registries
 * to identify potential conflicts and issues before they happen.
 * 
 * @example
 * ```tsx
 * import { validateLabelChange, validateComponentChange } from '@/lib/fmf';
 * 
 * // Before changing a label
 * const result = validateLabelChange('Mode', 'Theme');
 * if (!result.valid) {
 *   console.error('Cannot make this change:', result.errors);
 * }
 * ```
 */

import { UI_LABELS } from './ui-labels';
import { RESERVED_TERMS, getTermConflicts } from './reserved-terms';
import { COMPONENTS, getComponentDependents } from './components';
import { ROUTES, isValidRoute } from './routes';
import { STATE_KEYS, isStateKeyReserved } from './state-keys';
import type { ValidationResult, RiskLevel } from './types';

/**
 * Create a validation result
 */
function createResult(
  valid: boolean,
  errors: string[] = [],
  warnings: string[] = [],
  suggestions: string[] = [],
  riskLevel: RiskLevel = 'LOW'
): ValidationResult {
  return { valid, errors, warnings, suggestions, riskLevel };
}

/**
 * Validate a UI label change
 * @param currentLabel The current label value
 * @param newLabel The proposed new label value
 * @returns Validation result
 */
export function validateLabelChange(currentLabel: string, newLabel: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let riskLevel: RiskLevel = 'LOW';

  // Check if new label conflicts with reserved terms
  const conflicts = getTermConflicts(newLabel);
  if (conflicts.length > 0) {
    errors.push(...conflicts);
    riskLevel = 'HIGH';
  }

  // Check if the new label is already used elsewhere
  const existingLabels = findLabelUsages(newLabel);
  if (existingLabels.length > 0) {
    warnings.push(
      `"${newLabel}" is already used in: ${existingLabels.join(', ')}. ` +
      'This may cause confusion.'
    );
    riskLevel = riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM';
  }

  // Check for reserved term usage in current label
  for (const [key, term] of Object.entries(RESERVED_TERMS)) {
    if (currentLabel.toLowerCase().includes(term.term.toLowerCase())) {
      warnings.push(
        `Current label contains reserved term "${term.term}". ` +
        `Ensure the change maintains the intended meaning.`
      );
    }
  }

  // Suggest using UI_LABELS constant
  suggestions.push(
    'Remember to update the UI_LABELS constant in lib/fmf/ui-labels.ts'
  );

  return createResult(
    errors.length === 0,
    errors,
    warnings,
    suggestions,
    riskLevel
  );
}

/**
 * Find where a label is used in UI_LABELS
 */
function findLabelUsages(label: string): string[] {
  const usages: string[] = [];
  const lowerLabel = label.toLowerCase();

  function searchObject(obj: any, path: string) {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      if (typeof value === 'string' && value.toLowerCase() === lowerLabel) {
        usages.push(currentPath);
      } else if (typeof value === 'object' && value !== null) {
        searchObject(value, currentPath);
      }
    }
  }

  searchObject(UI_LABELS, 'UI_LABELS');
  return usages;
}

/**
 * Validate a component change
 * @param componentName The component being changed
 * @param changeDescription Description of the change
 * @returns Validation result
 */
export function validateComponentChange(
  componentName: string,
  changeDescription: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let riskLevel: RiskLevel = 'LOW';

  const component = COMPONENTS[componentName];
  
  if (!component) {
    warnings.push(
      `Component "${componentName}" not found in COMPONENTS registry. ` +
      'Consider adding it for better tracking.'
    );
    return createResult(true, errors, warnings, suggestions, 'MEDIUM');
  }

  // Check dependents
  const dependents = getComponentDependents(componentName);
  if (dependents.length > 0) {
    warnings.push(
      `This component has ${dependents.length} dependent(s): ${dependents.join(', ')}. ` +
      'Changes may affect these components.'
    );
    riskLevel = 'MEDIUM';
  }

  // Check for breaking changes
  const lowerDesc = changeDescription.toLowerCase();
  const breakingKeywords = ['remove', 'delete', 'rename', 'change prop', 'modify interface'];
  
  for (const keyword of breakingKeywords) {
    if (lowerDesc.includes(keyword)) {
      riskLevel = 'HIGH';
      warnings.push(
        `Change description contains "${keyword}" which may indicate a breaking change.`
      );
      
      if (component.breakingChanges.length > 0) {
        suggestions.push(
          `Known breaking changes for this component: ${component.breakingChanges.join('; ')}`
        );
      }
    }
  }

  // Check z-index layer
  if (component.zIndexLayer) {
    suggestions.push(
      `This component uses z-index layer: ${component.zIndexLayer}. ` +
      'Ensure any z-index changes follow the Z_INDEX scale.'
    );
  }

  return createResult(
    errors.length === 0,
    errors,
    warnings,
    suggestions,
    riskLevel
  );
}

/**
 * Validate a route change
 * @param path The route path
 * @param action 'add' | 'modify' | 'remove'
 * @returns Validation result
 */
export function validateRouteChange(
  path: string,
  action: 'add' | 'modify' | 'remove'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let riskLevel: RiskLevel = 'LOW';

  const routeExists = isValidRoute(path);

  switch (action) {
    case 'add':
      if (routeExists) {
        errors.push(`Route "${path}" already exists in ROUTES registry.`);
        riskLevel = 'HIGH';
      }
      suggestions.push('Remember to add the new route to ROUTES registry in lib/fmf/routes.ts');
      break;

    case 'modify':
      if (!routeExists) {
        warnings.push(`Route "${path}" not found in ROUTES registry.`);
      }
      riskLevel = 'MEDIUM';
      suggestions.push('Update the ROUTES registry if the route behavior changes.');
      break;

    case 'remove':
      if (routeExists) {
        warnings.push(
          `Removing route "${path}". Ensure no components link to this route.`
        );
        riskLevel = 'HIGH';
      }
      suggestions.push('Remove the route from ROUTES registry in lib/fmf/routes.ts');
      break;
  }

  return createResult(
    errors.length === 0,
    errors,
    warnings,
    suggestions,
    riskLevel
  );
}

/**
 * Validate a state key change
 * @param key The state/localStorage key
 * @param action 'add' | 'modify' | 'remove'
 * @returns Validation result
 */
export function validateStateKeyChange(
  key: string,
  action: 'add' | 'modify' | 'remove'
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let riskLevel: RiskLevel = 'LOW';

  const keyExists = isStateKeyReserved(key);

  switch (action) {
    case 'add':
      if (keyExists) {
        errors.push(`State key "${key}" already exists in STATE_KEYS registry.`);
        riskLevel = 'HIGH';
      }
      suggestions.push('Add the new key to STATE_KEYS registry in lib/fmf/state-keys.ts');
      suggestions.push('Use the STORAGE_PREFIX for consistency: "multi-ai-chat-"');
      break;

    case 'modify':
      if (keyExists) {
        warnings.push(
          `Modifying state key "${key}". This may break existing user data.`
        );
        riskLevel = 'HIGH';
        suggestions.push('Consider creating a migration for existing data.');
      }
      break;

    case 'remove':
      if (keyExists) {
        warnings.push(
          `Removing state key "${key}". Existing user data will be orphaned.`
        );
        riskLevel = 'HIGH';
        suggestions.push('Consider clearing the key from localStorage on app load.');
      }
      break;
  }

  return createResult(
    errors.length === 0,
    errors,
    warnings,
    suggestions,
    riskLevel
  );
}

/**
 * Validate a z-index change
 * @param componentName The component being changed
 * @param proposedZIndex The proposed z-index value
 * @returns Validation result
 */
export function validateZIndexChange(
  componentName: string,
  proposedZIndex: number | string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let riskLevel: RiskLevel = 'LOW';

  // Check if using arbitrary value
  if (typeof proposedZIndex === 'string' && proposedZIndex.includes('[')) {
    warnings.push(
      `Arbitrary z-index value "${proposedZIndex}" detected. ` +
      'Use Z_CLASS constants from lib/z-index.ts instead.'
    );
    riskLevel = 'MEDIUM';
  }

  // Check if using hardcoded number
  if (typeof proposedZIndex === 'number') {
    warnings.push(
      `Hardcoded z-index value "${proposedZIndex}" detected. ` +
      'Use Z_CLASS constants from lib/z-index.ts instead.'
    );
    riskLevel = 'MEDIUM';
  }

  // Check component's expected layer
  const component = COMPONENTS[componentName];
  if (component?.zIndexLayer) {
    suggestions.push(
      `This component should use z-index layer: ${component.zIndexLayer}. ` +
      'Check Z_CLASS for the appropriate constant.'
    );
  }

  suggestions.push(
    'Z-Index Scale: BASE(0-99), STICKY(100-149), DROPDOWN(200-249), ' +
    'FLOATING(250-299), MODAL_BACKDROP(300-349), MODAL(400-449), ' +
    'TOAST(500-549), TOOLTIP(600-649)'
  );

  return createResult(
    errors.length === 0,
    errors,
    warnings,
    suggestions,
    riskLevel
  );
}

/**
 * Run all validations for a proposed change
 * @param change Object describing the change
 * @returns Combined validation result
 */
export function validateChange(change: {
  type: 'label' | 'component' | 'route' | 'state' | 'zindex';
  target: string;
  description: string;
  newValue?: string | number;
  action?: 'add' | 'modify' | 'remove';
}): ValidationResult {
  switch (change.type) {
    case 'label':
      return validateLabelChange(change.target, change.newValue as string);
    
    case 'component':
      return validateComponentChange(change.target, change.description);
    
    case 'route':
      return validateRouteChange(change.target, change.action || 'modify');
    
    case 'state':
      return validateStateKeyChange(change.target, change.action || 'modify');
    
    case 'zindex':
      return validateZIndexChange(change.target, change.newValue || 0);
    
    default:
      return createResult(true, [], ['Unknown change type'], [], 'LOW');
  }
}

export type { ValidationResult };
