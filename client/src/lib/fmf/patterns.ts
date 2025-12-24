/**
 * PATTERNS - Code Patterns Registry
 * 
 * Registry of established code patterns that MUST be followed.
 * These patterns prevent common bugs and ensure consistency.
 * 
 * @example
 * ```tsx
 * import { PATTERNS } from '@/lib/fmf';
 * 
 * // Check the pattern before implementing
 * console.log(PATTERNS.STATE_MANAGEMENT.MEMOIZATION);
 * // Follow the example code provided
 * ```
 */

export interface PatternEntry {
  /** Pattern name */
  name: string;
  /** When to use this pattern */
  when: string;
  /** Why this pattern is important */
  why: string;
  /** Example code showing correct usage */
  example: string;
  /** Anti-pattern to avoid */
  antiPattern: string;
  /** Related patterns */
  related: string[];
}

export interface PatternCategory {
  /** Category name */
  name: string;
  /** Category description */
  description: string;
  /** Patterns in this category */
  patterns: Record<string, PatternEntry>;
}

export const PATTERNS: Record<string, PatternCategory> = {
  // ===========================================================================
  // STATE MANAGEMENT PATTERNS
  // ===========================================================================
  STATE_MANAGEMENT: {
    name: 'State Management',
    description: 'Patterns for managing React state and preventing infinite loops',
    patterns: {
      MEMOIZATION: {
        name: 'Memoize Computed Values',
        when: 'Computing derived values from state or props',
        why: 'Prevents infinite re-renders by stabilizing object/array references',
        example: `
// ✅ CORRECT: Memoize computed values
const sortedPresets = useMemo(() => {
  return [...presets].sort((a, b) => a.name.localeCompare(b.name));
}, [presets]);

// ✅ CORRECT: Memoize query inputs
const queryInput = useMemo(() => ({
  date: new Date(),
  filters: activeFilters,
}), [activeFilters]);
`,
        antiPattern: `
// ❌ WRONG: Creates new reference every render
const sortedPresets = [...presets].sort((a, b) => a.name.localeCompare(b.name));

// ❌ WRONG: New object in query causes infinite loop
const { data } = trpc.items.get.useQuery({ date: new Date() });
`,
        related: ['STABLE_REFERENCES', 'EFFECT_DEPENDENCIES'],
      },

      STABLE_REFERENCES: {
        name: 'Stable References in Dependencies',
        when: 'Using objects/arrays in useEffect or useCallback dependencies',
        why: 'Unstable references cause effects to run on every render',
        example: `
// ✅ CORRECT: Initialize once with useState
const [initialDate] = useState(() => new Date());

// ✅ CORRECT: Use primitive values in dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]); // userId is a string, stable

// ✅ CORRECT: Use JSON.stringify for object comparison
const filterKey = JSON.stringify(filters);
useEffect(() => {
  applyFilters(filters);
}, [filterKey]);
`,
        antiPattern: `
// ❌ WRONG: Object in dependency array
useEffect(() => {
  fetchData(options);
}, [options]); // options is recreated every render!

// ❌ WRONG: Array in dependency array
useEffect(() => {
  processItems(items);
}, [items]); // items reference changes every render!
`,
        related: ['MEMOIZATION', 'EFFECT_DEPENDENCIES'],
      },

      EFFECT_DEPENDENCIES: {
        name: 'Correct useEffect Dependencies',
        when: 'Writing useEffect hooks',
        why: 'Missing or incorrect dependencies cause stale closures or infinite loops',
        example: `
// ✅ CORRECT: Include all used values
useEffect(() => {
  const handler = () => setCount(count + 1);
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, [count]);

// ✅ CORRECT: Use functional updates to avoid dependencies
useEffect(() => {
  const handler = () => setCount(c => c + 1);
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []); // No dependency needed!
`,
        antiPattern: `
// ❌ WRONG: Missing dependency
useEffect(() => {
  fetchUser(userId);
}, []); // userId is used but not in deps!

// ❌ WRONG: Effect modifies its own dependency
useEffect(() => {
  setItems([...items, newItem]); // items in deps causes loop!
}, [items]);
`,
        related: ['MEMOIZATION', 'STABLE_REFERENCES'],
      },
    },
  },

  // ===========================================================================
  // Z-INDEX PATTERNS
  // ===========================================================================
  Z_INDEX: {
    name: 'Z-Index Management',
    description: 'Patterns for managing z-index to prevent layering issues',
    patterns: {
      USE_Z_CLASS: {
        name: 'Use Z_CLASS Constants',
        when: 'Setting z-index on any element',
        why: 'Ensures consistent layering and prevents conflicts',
        example: `
// ✅ CORRECT: Import and use Z_CLASS
import { Z_CLASS } from '@/lib/z-index';

<div className={Z_CLASS.DROPDOWN}>Dropdown content</div>
<div className={Z_CLASS.MODAL}>Modal content</div>
<div className={Z_CLASS.FLOATING}>Floating window</div>
`,
        antiPattern: `
// ❌ WRONG: Hardcoded z-index
<div className="z-50">...</div>
<div className="z-[9999]">...</div>
<div style={{ zIndex: 100 }}>...</div>
`,
        related: ['Z_INDEX_SCALE'],
      },

      Z_INDEX_SCALE: {
        name: 'Follow Z-Index Scale',
        when: 'Deciding what z-index value to use',
        why: 'Maintains predictable layering hierarchy',
        example: `
// Z-Index Scale (from z-index.ts):
// BASE:           0-99     (static content)
// STICKY:         100-149  (sticky headers)
// DROPDOWN:       200-249  (dropdowns, popovers)
// FLOATING:       250-299  (floating windows)
// SIDEBAR:        275-299  (sidebar menus)
// MODAL_BACKDROP: 300-349  (modal backdrops)
// MODAL:          400-449  (modal content)
// TOAST:          500-549  (notifications)
// TOOLTIP:        600-649  (tooltips)
// MAX:            9999     (emergency only)
`,
        antiPattern: `
// ❌ WRONG: Arbitrary values
z-[1000]  // What layer is this?
z-[42]    // Random number
z-[99999] // "I want to be on top!"
`,
        related: ['USE_Z_CLASS'],
      },
    },
  },

  // ===========================================================================
  // TOUCH/MOBILE PATTERNS
  // ===========================================================================
  TOUCH_HANDLING: {
    name: 'Touch Event Handling',
    description: 'Patterns for handling touch events on mobile devices',
    patterns: {
      DUAL_EVENTS: {
        name: 'Handle Both Click and Touch',
        when: 'Creating interactive elements',
        why: 'Ensures elements work on both desktop and mobile',
        example: `
// ✅ CORRECT: Handle both events
<button
  onClick={handleAction}
  onTouchEnd={(e) => {
    e.preventDefault(); // Prevent ghost click
    handleAction();
  }}
>
  Click me
</button>

// ✅ CORRECT: For drag operations
const handlers = {
  onMouseDown: handleDragStart,
  onMouseMove: handleDragMove,
  onMouseUp: handleDragEnd,
  onTouchStart: handleDragStart,
  onTouchMove: handleDragMove,
  onTouchEnd: handleDragEnd,
};
`,
        antiPattern: `
// ❌ WRONG: Only click handler
<button onClick={handleAction}>Click me</button>

// ❌ WRONG: Only mouse events for drag
onMouseDown={handleDragStart}
onMouseMove={handleDragMove}
onMouseUp={handleDragEnd}
`,
        related: ['TOUCH_TARGETS'],
      },

      TOUCH_TARGETS: {
        name: 'Minimum Touch Target Size',
        when: 'Creating clickable/tappable elements',
        why: 'Small targets are hard to tap on mobile',
        example: `
// ✅ CORRECT: Minimum 44x44px touch target
<button className="min-h-[44px] min-w-[44px] p-3">
  <Icon size={16} />
</button>

// ✅ CORRECT: Expand hit area with padding
<button className="p-4 -m-4"> {/* Negative margin keeps visual size */}
  <SmallIcon />
</button>
`,
        antiPattern: `
// ❌ WRONG: Tiny touch target
<button className="w-4 h-4">
  <Icon size={16} />
</button>

// ❌ WRONG: No padding around icon
<button>
  <Icon size={12} />
</button>
`,
        related: ['DUAL_EVENTS'],
      },
    },
  },

  // ===========================================================================
  // DROPDOWN/POSITIONING PATTERNS
  // ===========================================================================
  POSITIONING: {
    name: 'Element Positioning',
    description: 'Patterns for positioning dropdowns, modals, and floating elements',
    patterns: {
      VIEWPORT_AWARE: {
        name: 'Viewport-Aware Positioning',
        when: 'Positioning dropdowns or floating elements',
        why: 'Prevents content from going off-screen',
        example: `
// ✅ CORRECT: Check available space
const openDirection = useMemo(() => {
  const rect = triggerRef.current?.getBoundingClientRect();
  if (!rect) return 'bottom';
  
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  
  return spaceBelow >= 200 ? 'bottom' : 'top';
}, [isOpen]);

// ✅ CORRECT: Use Radix positioning props
<DropdownMenu.Content
  side="bottom"
  sideOffset={4}
  align="start"
  collisionPadding={16}
>
`,
        antiPattern: `
// ❌ WRONG: Fixed positioning without checks
<div className="absolute top-full left-0">
  {/* May go off-screen! */}
</div>

// ❌ WRONG: Hardcoded direction
<DropdownMenu.Content side="bottom">
  {/* What if there's no space below? */}
</DropdownMenu.Content>
`,
        related: ['OVERFLOW_HANDLING'],
      },

      OVERFLOW_HANDLING: {
        name: 'Handle Overflow Correctly',
        when: 'Content may exceed container bounds',
        why: 'Prevents horizontal scroll and content cutoff',
        example: `
// ✅ CORRECT: Constrain width and handle overflow
<div className="w-full max-w-full overflow-x-hidden">
  <div className="max-w-[calc(100vw-2rem)]">
    {content}
  </div>
</div>

// ✅ CORRECT: Scrollable container for long content
<div className="max-h-[300px] overflow-y-auto">
  {longList}
</div>
`,
        antiPattern: `
// ❌ WRONG: Fixed width exceeding viewport
<div className="w-[500px]">...</div>

// ❌ WRONG: No overflow handling
<div className="absolute w-full">
  {/* May cause horizontal scroll */}
</div>
`,
        related: ['VIEWPORT_AWARE'],
      },
    },
  },

  // ===========================================================================
  // THEME PATTERNS
  // ===========================================================================
  THEMING: {
    name: 'Theme Management',
    description: 'Patterns for handling dark/light themes',
    patterns: {
      SEMANTIC_COLORS: {
        name: 'Use Semantic Color Classes',
        when: 'Applying colors to elements',
        why: 'Ensures colors adapt to theme changes',
        example: `
// ✅ CORRECT: Pair background with foreground
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground">
<div className="bg-popover text-popover-foreground">
<div className="bg-accent text-accent-foreground">
<div className="bg-muted text-muted-foreground">
`,
        antiPattern: `
// ❌ WRONG: Background without foreground
<div className="bg-background">
  Text here may be invisible!
</div>

// ❌ WRONG: Hardcoded colors
<div className="bg-white text-black">
  Won't adapt to dark mode!
</div>
`,
        related: ['THEME_PROVIDER'],
      },

      THEME_PROVIDER: {
        name: 'Match Theme Provider to CSS',
        when: 'Setting up ThemeProvider',
        why: 'Mismatched theme causes invisible text',
        example: `
// ✅ CORRECT: Theme matches CSS variables
// In App.tsx:
<ThemeProvider defaultTheme="dark">

// In index.css:
.dark {
  --background: 224 71% 4%;  /* Dark background */
  --foreground: 213 31% 91%; /* Light text */
}
`,
        antiPattern: `
// ❌ WRONG: Theme doesn't match CSS
// In App.tsx:
<ThemeProvider defaultTheme="dark">

// In index.css:
.dark {
  --background: 0 0% 100%;   /* White background?! */
  --foreground: 0 0% 0%;     /* Black text on white in dark mode?! */
}
`,
        related: ['SEMANTIC_COLORS'],
      },
    },
  },
};

/**
 * Get a specific pattern by category and name
 * @param category The pattern category
 * @param patternName The pattern name
 * @returns The pattern entry or undefined
 */
export function getPattern(category: string, patternName: string): PatternEntry | undefined {
  const cat = PATTERNS[category];
  if (!cat) return undefined;
  return cat.patterns[patternName];
}

/**
 * Get all patterns in a category
 * @param category The pattern category
 * @returns Array of pattern entries
 */
export function getPatternsInCategory(category: string): PatternEntry[] {
  const cat = PATTERNS[category];
  if (!cat) return [];
  return Object.values(cat.patterns);
}

/**
 * Search patterns by keyword
 * @param keyword The keyword to search for
 * @returns Array of matching patterns with their category
 */
export function searchPatterns(keyword: string): Array<{ category: string; pattern: PatternEntry }> {
  const results: Array<{ category: string; pattern: PatternEntry }> = [];
  const lowerKeyword = keyword.toLowerCase();
  
  for (const [categoryKey, category] of Object.entries(PATTERNS)) {
    for (const pattern of Object.values(category.patterns)) {
      if (
        pattern.name.toLowerCase().includes(lowerKeyword) ||
        pattern.when.toLowerCase().includes(lowerKeyword) ||
        pattern.why.toLowerCase().includes(lowerKeyword)
      ) {
        results.push({ category: categoryKey, pattern });
      }
    }
  }
  
  return results;
}

/**
 * Get all pattern categories
 * @returns Array of category names
 */
export function getPatternCategories(): string[] {
  return Object.keys(PATTERNS);
}
