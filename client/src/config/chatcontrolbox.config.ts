/**
 * ChatControlBox Configuration
 * =============================
 * 
 * SINGLE SOURCE OF TRUTH for all ChatControlBox dimensions and proportions.
 * 
 * PROPORTIONALITY RULE:
 * All dimensions derive from the master `rowHeight` value.
 * To resize the entire component, change ONLY `rowHeight`.
 * Never use arbitrary pixel values in the component.
 * 
 * REFERENCE DESIGN: /home/ubuntu/upload/1000014578.png
 * - 2-row layout: toolbar row + input row
 * - Both rows have equal visual weight
 * - 7 toolbar items: Menu, Plus, Models, Bot, Settings, Save, Presets
 * - Input row: Paperclip, Input field, Mic, Send
 */

// =============================================================================
// MASTER DIMENSION
// =============================================================================

/**
 * The master dimension from which all other sizes are derived.
 * Based on reference design analysis:
 * - Total component height ≈ 140px
 * - Each row ≈ 56px (with padding)
 * - Row content height ≈ 48px
 */
export const MASTER_ROW_HEIGHT = 48;

// =============================================================================
// PROPORTIONAL RATIOS
// =============================================================================

/**
 * All ratios are relative to MASTER_ROW_HEIGHT (1.0 = 48px)
 * These ratios ensure balanced visual weight across all elements.
 */
export const RATIOS = {
  // Icon sizes
  toolbarIcon: 0.5,           // 24px - Menu, Plus, Bot, Settings, Save icons
  inputIcon: 0.458,           // 22px - Paperclip, Mic icons (slightly smaller)
  sendIcon: 0.417,            // 20px - Send arrow icon
  
  // Button sizes
  toolbarIconButton: 0.833,   // 40px - Clickable area for icon buttons
  modelsButton: {
    height: 0.833,            // 40px - Models pill button height
    minWidth: 2.083,          // 100px - Minimum width for "3 Models" text
  },
  presetsButton: {
    height: 0.833,            // 40px - Presets button height
    minWidth: 1.875,          // 90px - Minimum width for "Presets" text
  },
  sendButton: 0.75,           // 36px - Send button diameter
  
  // Spacing
  toolbarGap: 0.25,           // 12px - Gap between toolbar items
  rowGap: 0.25,               // 12px - Gap between toolbar and input rows
  containerPadding: 0.333,    // 16px - Container padding (left/right)
  containerPaddingY: 0.25,    // 12px - Container padding (top/bottom)
  
  // Input field
  inputHeight: 0.917,         // 44px - Input field height
  inputBorderRadius: 0.458,   // 22px - Full rounded (half of height)
  inputPaddingX: 0.333,       // 16px - Input horizontal padding
  
  // Container
  containerBorderRadius: 0.333, // 16px - Container corner radius
  
  // Typography
  fontSize: 0.292,            // 14px - Button text size
  fontSizeSmall: 0.25,        // 12px - Small text size
} as const;

// =============================================================================
// COMPUTED VALUES (in pixels)
// =============================================================================

/**
 * Computed pixel values derived from MASTER_ROW_HEIGHT and RATIOS.
 * Use these values in the component via CSS variables.
 */
export const COMPUTED = {
  // Row heights
  rowHeight: MASTER_ROW_HEIGHT,
  
  // Icon sizes
  toolbarIconSize: Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarIcon),
  inputIconSize: Math.round(MASTER_ROW_HEIGHT * RATIOS.inputIcon),
  sendIconSize: Math.round(MASTER_ROW_HEIGHT * RATIOS.sendIcon),
  
  // Button sizes
  toolbarIconButtonSize: Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarIconButton),
  modelsButtonHeight: Math.round(MASTER_ROW_HEIGHT * RATIOS.modelsButton.height),
  modelsButtonMinWidth: Math.round(MASTER_ROW_HEIGHT * RATIOS.modelsButton.minWidth),
  presetsButtonHeight: Math.round(MASTER_ROW_HEIGHT * RATIOS.presetsButton.height),
  presetsButtonMinWidth: Math.round(MASTER_ROW_HEIGHT * RATIOS.presetsButton.minWidth),
  sendButtonSize: Math.round(MASTER_ROW_HEIGHT * RATIOS.sendButton),
  
  // Spacing
  toolbarGap: Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarGap),
  rowGap: Math.round(MASTER_ROW_HEIGHT * RATIOS.rowGap),
  containerPadding: Math.round(MASTER_ROW_HEIGHT * RATIOS.containerPadding),
  containerPaddingY: Math.round(MASTER_ROW_HEIGHT * RATIOS.containerPaddingY),
  
  // Input field
  inputHeight: Math.round(MASTER_ROW_HEIGHT * RATIOS.inputHeight),
  inputBorderRadius: Math.round(MASTER_ROW_HEIGHT * RATIOS.inputBorderRadius),
  inputPaddingX: Math.round(MASTER_ROW_HEIGHT * RATIOS.inputPaddingX),
  
  // Container
  containerBorderRadius: Math.round(MASTER_ROW_HEIGHT * RATIOS.containerBorderRadius),
  
  // Typography
  fontSize: Math.round(MASTER_ROW_HEIGHT * RATIOS.fontSize),
  fontSizeSmall: Math.round(MASTER_ROW_HEIGHT * RATIOS.fontSizeSmall),
} as const;

// =============================================================================
// MINIMUM WIDTH CALCULATION
// =============================================================================

/**
 * Calculate the minimum container width needed to fit all toolbar items.
 * 
 * Toolbar items:
 * 1. Menu icon button (40px)
 * 2. Plus icon button (40px)
 * 3. Models pill button (100px min)
 * 4. Bot icon button (40px)
 * 5. Settings icon button (40px)
 * 6. Save icon button (40px)
 * 7. Presets button (90px min)
 * 
 * Total: 7 items + 6 gaps + 2 padding
 */
export const MIN_CONTAINER_WIDTH = 
  (COMPUTED.toolbarIconButtonSize * 5) +  // 5 icon buttons: Menu, Plus, Bot, Settings, Save
  COMPUTED.modelsButtonMinWidth +          // Models pill
  COMPUTED.presetsButtonMinWidth +         // Presets button
  (COMPUTED.toolbarGap * 6) +              // 6 gaps between 7 items
  (COMPUTED.containerPadding * 2);         // Left + right padding

// =============================================================================
// CSS VARIABLES GENERATOR
// =============================================================================

/**
 * Generate CSS custom properties for use in the component.
 * Apply these to the component root element via style prop.
 */
export const getCSSVariables = (): React.CSSProperties => ({
  '--ccb-row-height': `${COMPUTED.rowHeight}px`,
  '--ccb-toolbar-icon-size': `${COMPUTED.toolbarIconSize}px`,
  '--ccb-input-icon-size': `${COMPUTED.inputIconSize}px`,
  '--ccb-send-icon-size': `${COMPUTED.sendIconSize}px`,
  '--ccb-toolbar-icon-button-size': `${COMPUTED.toolbarIconButtonSize}px`,
  '--ccb-models-button-height': `${COMPUTED.modelsButtonHeight}px`,
  '--ccb-models-button-min-width': `${COMPUTED.modelsButtonMinWidth}px`,
  '--ccb-presets-button-height': `${COMPUTED.presetsButtonHeight}px`,
  '--ccb-presets-button-min-width': `${COMPUTED.presetsButtonMinWidth}px`,
  '--ccb-send-button-size': `${COMPUTED.sendButtonSize}px`,
  '--ccb-toolbar-gap': `${COMPUTED.toolbarGap}px`,
  '--ccb-row-gap': `${COMPUTED.rowGap}px`,
  '--ccb-container-padding': `${COMPUTED.containerPadding}px`,
  '--ccb-container-padding-y': `${COMPUTED.containerPaddingY}px`,
  '--ccb-input-height': `${COMPUTED.inputHeight}px`,
  '--ccb-input-border-radius': `${COMPUTED.inputBorderRadius}px`,
  '--ccb-input-padding-x': `${COMPUTED.inputPaddingX}px`,
  '--ccb-container-border-radius': `${COMPUTED.containerBorderRadius}px`,
  '--ccb-font-size': `${COMPUTED.fontSize}px`,
  '--ccb-font-size-small': `${COMPUTED.fontSizeSmall}px`,
  '--ccb-min-width': `${MIN_CONTAINER_WIDTH}px`,
} as React.CSSProperties);

// =============================================================================
// TAILWIND CLASS HELPERS
// =============================================================================

/**
 * Pre-computed Tailwind-compatible class strings for common patterns.
 * Note: These use arbitrary values [Xpx] which should be replaced with
 * CSS variables in the actual component for true proportional scaling.
 */
export const TAILWIND_CLASSES = {
  toolbarIconButton: `w-[${COMPUTED.toolbarIconButtonSize}px] h-[${COMPUTED.toolbarIconButtonSize}px]`,
  toolbarIcon: `w-[${COMPUTED.toolbarIconSize}px] h-[${COMPUTED.toolbarIconSize}px]`,
  inputIcon: `w-[${COMPUTED.inputIconSize}px] h-[${COMPUTED.inputIconSize}px]`,
  sendButton: `w-[${COMPUTED.sendButtonSize}px] h-[${COMPUTED.sendButtonSize}px]`,
  sendIcon: `w-[${COMPUTED.sendIconSize}px] h-[${COMPUTED.sendIconSize}px]`,
} as const;

// =============================================================================
// RATIO TABLE (for documentation)
// =============================================================================

/**
 * Ratio Table for Documentation
 * 
 * | Element              | Ratio to Row Height | Computed (px) | Notes                    |
 * |----------------------|---------------------|---------------|--------------------------|
 * | Row Height (master)  | 1.0                 | 48px          | Base unit                |
 * | Toolbar Icon         | 0.5                 | 24px          | Menu, Plus, Bot, etc.    |
 * | Input Icon           | 0.458               | 22px          | Paperclip, Mic           |
 * | Send Icon            | 0.417               | 20px          | Arrow up                 |
 * | Toolbar Icon Button  | 0.833               | 40px          | Clickable area           |
 * | Models Button Height | 0.833               | 40px          | Blue pill                |
 * | Presets Button Height| 0.833               | 40px          | Gray pill                |
 * | Send Button          | 0.75                | 36px          | Circular button          |
 * | Toolbar Gap          | 0.25                | 12px          | Between items            |
 * | Row Gap              | 0.25                | 12px          | Between rows             |
 * | Container Padding    | 0.333               | 16px          | Left/right               |
 * | Input Height         | 0.917               | 44px          | Text input field         |
 * | Input Border Radius  | 0.458               | 22px          | Full rounded             |
 * | Container Radius     | 0.333               | 16px          | Corner radius            |
 * | Font Size            | 0.292               | 14px          | Button text              |
 * | Min Container Width  | -                   | 362px         | Calculated               |
 */

export default {
  MASTER_ROW_HEIGHT,
  RATIOS,
  COMPUTED,
  MIN_CONTAINER_WIDTH,
  getCSSVariables,
  TAILWIND_CLASSES,
};
