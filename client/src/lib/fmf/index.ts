/**
 * Fix-Modify Framework (FMF)
 * 
 * Universal Code Modification Framework
 * 
 * This module provides centralized registries for all protected values in the application.
 * Any code modification MUST check these registries before making changes.
 * 
 * @example
 * ```tsx
 * import { UI_LABELS, RESERVED_TERMS, COMPONENTS } from '@/lib/fmf';
 * 
 * // Use UI_LABELS for all user-facing text
 * <span>{UI_LABELS.HEADER.THEME}</span>
 * 
 * // Check RESERVED_TERMS before using terminology
 * if (RESERVED_TERMS.MODE.alternatives.includes(proposedTerm)) {
 *   // Safe to use
 * }
 * 
 * // Check COMPONENTS before modifying
 * const deps = COMPONENTS.FloatingChatWindow.dependents;
 * ```
 * 
 * @see /docs/FIX_MODIFY_FRAMEWORK.md for complete documentation
 */

// Core Registries
export { UI_LABELS, type UILabelsType } from './ui-labels';
export { RESERVED_TERMS, isTermReserved, getTermConflicts, type ReservedTerm } from './reserved-terms';
export { COMPONENTS, getComponentDependents, getComponentDependencies, type ComponentEntry } from './components';
export { ROUTES, getRouteByPath, getRoutesByComponent, type RouteEntry } from './routes';
export { STATE_KEYS, isStateKeyReserved, type StateKeyEntry } from './state-keys';
export { PATTERNS, type PatternCategory } from './patterns';
export { RELATIONSHIPS, type RelationshipMap } from './relationships';

// Utility Functions
export { 
  validateLabelChange,
  validateComponentChange,
  validateRouteChange,
  validateStateKeyChange,
  type ValidationResult 
} from './validators';

// Types
export type { FMFRegistry, ChangeClassification, RiskLevel } from './types';
