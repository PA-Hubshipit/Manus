/**
 * Centralized Z-Index Management System
 * =====================================
 * 
 * This file is the SINGLE SOURCE OF TRUTH for all z-index values in the application.
 * 
 * WHY THIS EXISTS:
 * - Prevents z-index conflicts between components
 * - Ensures consistent layering across the entire app
 * - Makes it easy to understand the visual stacking order
 * - Provides TypeScript enforcement to catch errors at compile time
 * 
 * RULES:
 * 1. NEVER use arbitrary z-index values (z-50, z-[999], etc.) in components
 * 2. ALWAYS import from this file and use the provided constants
 * 3. If you need a new layer, add it here with proper documentation
 * 4. The ESLint rule will warn you if you use arbitrary z-index values
 * 
 * LAYER HIERARCHY (from bottom to top):
 * ┌─────────────────────────────────────────────────────────────┐
 * │ z-9999  CRITICAL    │ System-level overlays, loading screens │
 * │ z-500   TOAST       │ Toast notifications, snackbars          │
 * │ z-450   NESTED_MODAL│ Modals inside modals                    │
 * │ z-400   MODAL       │ Modal dialogs, full-screen overlays     │
 * │ z-350   MODAL_BACKDROP │ Dark backdrop behind modals          │
 * │ z-300   POPOVER     │ Popovers, tooltips                      │
 * │ z-250   DROPDOWN    │ Dropdown menus, select menus            │
 * │ z-200   FLOATING    │ Floating windows, chat windows          │
 * │ z-150   STICKY      │ Sticky headers, floating action buttons │
 * │ z-100   ELEVATED    │ Cards with elevation, raised elements   │
 * │ z-50    ABOVE       │ Elements slightly above normal flow     │
 * │ z-0     BASE        │ Normal document flow                    │
 * │ z-(-1)  BELOW       │ Background elements, decorations        │
 * └─────────────────────────────────────────────────────────────┘
 */

// =============================================================================
// Z-INDEX SCALE - TypeScript Enforced Constants
// =============================================================================

/**
 * The complete z-index scale for the application.
 * Use these values EXCLUSIVELY - never use arbitrary z-index values.
 */
export const Z_INDEX = {
  /** Background elements, decorations (z-index: -1) */
  BELOW: -1,
  
  /** Normal document flow (z-index: 0) */
  BASE: 0,
  
  /** Elements slightly above normal flow (z-index: 50) */
  ABOVE: 50,
  
  /** Cards with elevation, raised elements (z-index: 100) */
  ELEVATED: 100,
  
  /** Sticky headers, floating action buttons (z-index: 150) */
  STICKY: 150,
  
  /** Floating windows, chat windows (z-index: 200) */
  FLOATING: 200,
  
  /** Dropdown menus, select menus (z-index: 250) */
  DROPDOWN: 250,
  
  /** Popovers, tooltips (z-index: 300) */
  POPOVER: 300,
  
  /** Dark backdrop behind modals (z-index: 350) */
  MODAL_BACKDROP: 350,
  
  /** Modal dialogs, full-screen overlays (z-index: 400) */
  MODAL: 400,
  
  /** Modals inside modals, confirmation dialogs (z-index: 450) */
  NESTED_MODAL: 450,
  
  /** Toast notifications, snackbars (z-index: 500) */
  TOAST: 500,
  
  /** System-level overlays, loading screens (z-index: 9999) */
  CRITICAL: 9999,
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/** All valid z-index layer names */
export type ZIndexLayer = keyof typeof Z_INDEX;

/** All valid z-index values */
export type ZIndexValue = typeof Z_INDEX[ZIndexLayer];

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the z-index value for a specific layer.
 * Use this function to ensure type safety when accessing z-index values.
 * 
 * @example
 * const modalZ = getZIndex('MODAL'); // Returns 400
 * const dropdownZ = getZIndex('DROPDOWN'); // Returns 250
 */
export function getZIndex(layer: ZIndexLayer): ZIndexValue {
  return Z_INDEX[layer];
}

/**
 * Get the Tailwind CSS class for a z-index layer.
 * Returns the appropriate z-[value] class for use in className.
 * 
 * @example
 * <div className={getZIndexClass('MODAL')}>Modal content</div>
 * // Renders: <div class="z-[400]">Modal content</div>
 */
export function getZIndexClass(layer: ZIndexLayer): string {
  const value = Z_INDEX[layer];
  if (value < 0) {
    return `z-[${value}]`;
  }
  return `z-[${value}]`;
}

/**
 * Get inline style object for z-index.
 * Useful when you need to apply z-index via style prop.
 * 
 * @example
 * <div style={getZIndexStyle('FLOATING')}>Floating window</div>
 */
export function getZIndexStyle(layer: ZIndexLayer): { zIndex: number } {
  return { zIndex: Z_INDEX[layer] };
}

// =============================================================================
// TAILWIND CLASS CONSTANTS
// =============================================================================

/**
 * Pre-computed Tailwind classes for each z-index layer.
 * Use these directly in className for better readability.
 * 
 * @example
 * <div className={Z_CLASS.MODAL}>Modal content</div>
 */
export const Z_CLASS = {
  BELOW: 'z-[-1]',
  BASE: 'z-0',
  ABOVE: 'z-[50]',
  ELEVATED: 'z-[100]',
  STICKY: 'z-[150]',
  FLOATING: 'z-[200]',
  DROPDOWN: 'z-[250]',
  POPOVER: 'z-[300]',
  MODAL_BACKDROP: 'z-[350]',
  MODAL: 'z-[400]',
  NESTED_MODAL: 'z-[450]',
  TOAST: 'z-[500]',
  CRITICAL: 'z-[9999]',
} as const;

// =============================================================================
// COMPONENT-SPECIFIC MAPPINGS
// =============================================================================

/**
 * Recommended z-index layers for common component types.
 * Use this as a reference when building new components.
 */
export const COMPONENT_Z_INDEX = {
  // Layout components
  header: Z_INDEX.STICKY,
  sidebar: Z_INDEX.ELEVATED,
  footer: Z_INDEX.ELEVATED,
  
  // Floating elements
  floatingWindow: Z_INDEX.FLOATING,
  floatingButton: Z_INDEX.STICKY,
  windowDock: Z_INDEX.FLOATING,
  
  // Menus and dropdowns
  dropdownMenu: Z_INDEX.DROPDOWN,
  selectMenu: Z_INDEX.DROPDOWN,
  contextMenu: Z_INDEX.DROPDOWN,
  
  // Popovers and tooltips
  tooltip: Z_INDEX.POPOVER,
  popover: Z_INDEX.POPOVER,
  
  // Modals and dialogs
  modalBackdrop: Z_INDEX.MODAL_BACKDROP,
  modal: Z_INDEX.MODAL,
  dialog: Z_INDEX.MODAL,
  drawer: Z_INDEX.MODAL,
  nestedModal: Z_INDEX.NESTED_MODAL,
  confirmDialog: Z_INDEX.NESTED_MODAL,
  
  // Notifications
  toast: Z_INDEX.TOAST,
  notification: Z_INDEX.TOAST,
  snackbar: Z_INDEX.TOAST,
  
  // System
  loadingOverlay: Z_INDEX.CRITICAL,
  errorBoundary: Z_INDEX.CRITICAL,
} as const;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a z-index value is valid according to our scale.
 * Useful for runtime validation or testing.
 */
export function isValidZIndex(value: number): boolean {
  return Object.values(Z_INDEX).includes(value as ZIndexValue);
}

/**
 * Get the layer name for a z-index value.
 * Returns undefined if the value is not in our scale.
 */
export function getLayerName(value: number): ZIndexLayer | undefined {
  const entries = Object.entries(Z_INDEX) as [ZIndexLayer, ZIndexValue][];
  const entry = entries.find(([_, v]) => v === value);
  return entry?.[0];
}
