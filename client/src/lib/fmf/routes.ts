/**
 * ROUTES - Application Routes Registry
 * 
 * Registry of all application routes with their components and behaviors.
 * Before adding or modifying routes, check this registry.
 * 
 * @example
 * ```tsx
 * import { ROUTES, getRouteByPath } from '@/lib/fmf';
 * 
 * // Check if a route exists
 * const route = getRouteByPath('/agents');
 * if (route) {
 *   console.log('Component:', route.component);
 *   console.log('Status:', route.status);
 * }
 * ```
 */

export interface RouteEntry {
  /** Route path */
  path: string;
  /** Component that renders this route */
  component: string;
  /** Human-readable name for this route */
  name: string;
  /** Brief description of the route's purpose */
  description: string;
  /** Whether this route is active, coming soon, or deprecated */
  status: 'active' | 'coming-soon' | 'deprecated';
  /** Parent route if this is a nested route */
  parent?: string;
  /** Child routes if this has nested routes */
  children?: string[];
  /** Query parameters this route accepts */
  queryParams?: string[];
  /** Whether this route requires authentication */
  requiresAuth: boolean;
  /** Mode value associated with this route (for ModeMenu) */
  modeValue?: string;
}

export const ROUTES: Record<string, RouteEntry> = {
  // ===========================================================================
  // MAIN ROUTES
  // ===========================================================================

  HOME: {
    path: '/',
    component: 'Home',
    name: 'Home',
    description: 'Main home page with chat interface',
    status: 'active',
    requiresAuth: false,
    modeValue: undefined,
  },

  EMPTY: {
    path: '/empty',
    component: 'EmptyPage',
    name: 'Empty Canvas',
    description: 'Empty canvas with floating chat windows',
    status: 'active',
    requiresAuth: false,
    modeValue: 'empty',
  },

  CHAT: {
    path: '/chat',
    component: 'EmptyPage',
    name: 'Chat',
    description: 'Opens a new chat window on empty canvas',
    status: 'active',
    requiresAuth: false,
    modeValue: 'chat',
  },

  CONVERSATION: {
    path: '/conversation',
    component: 'ConversationPage',
    name: 'Conversation',
    description: 'Conversation mode (coming soon)',
    status: 'coming-soon',
    requiresAuth: false,
    modeValue: 'conversation',
  },

  AGENTS: {
    path: '/agents',
    component: 'AgentsPage',
    name: 'Agents',
    description: 'AI Agents mode (coming soon)',
    status: 'coming-soon',
    requiresAuth: false,
    modeValue: 'agents',
  },

  // ===========================================================================
  // TEST/DEBUG ROUTES
  // ===========================================================================

  TEST_CHAT_CONTROL_BOX: {
    path: '/test/chat-control-box',
    component: 'ChatControlBoxTestPage',
    name: 'ChatControlBox Test',
    description: 'Test page for ChatControlBox component',
    status: 'active',
    requiresAuth: false,
  },

  // ===========================================================================
  // ERROR ROUTES
  // ===========================================================================

  NOT_FOUND: {
    path: '*',
    component: 'NotFound',
    name: 'Not Found',
    description: 'Catch-all route for 404 errors',
    status: 'active',
    requiresAuth: false,
  },
};

/**
 * Get route entry by path
 * @param path The route path to look up
 * @returns The route entry or undefined
 */
export function getRouteByPath(path: string): RouteEntry | undefined {
  return Object.values(ROUTES).find(r => r.path === path);
}

/**
 * Get all routes that use a specific component
 * @param componentName The component name to search for
 * @returns Array of route entries
 */
export function getRoutesByComponent(componentName: string): RouteEntry[] {
  return Object.values(ROUTES).filter(r => r.component === componentName);
}

/**
 * Get route by mode value (for ModeMenu)
 * @param modeValue The mode value to look up
 * @returns The route entry or undefined
 */
export function getRouteByMode(modeValue: string): RouteEntry | undefined {
  return Object.values(ROUTES).find(r => r.modeValue === modeValue);
}

/**
 * Get all active routes
 * @returns Array of active route entries
 */
export function getActiveRoutes(): RouteEntry[] {
  return Object.values(ROUTES).filter(r => r.status === 'active');
}

/**
 * Get all mode routes (routes that appear in ModeMenu)
 * @returns Array of route entries with modeValue
 */
export function getModeRoutes(): RouteEntry[] {
  return Object.values(ROUTES).filter(r => r.modeValue !== undefined);
}

/**
 * Check if a path is a valid route
 * @param path The path to check
 * @returns true if the path is a valid route
 */
export function isValidRoute(path: string): boolean {
  return Object.values(ROUTES).some(r => r.path === path);
}

/**
 * Get the navigation path for a mode
 * @param modeValue The mode value
 * @returns The path to navigate to, or '/' if not found
 */
export function getPathForMode(modeValue: string): string {
  const route = getRouteByMode(modeValue);
  return route?.path ?? '/';
}

/**
 * MODE_VALUES - Valid mode values for ModeMenu
 * These must match the modeValue in ROUTES
 */
export const MODE_VALUES = {
  EMPTY: 'empty',
  CHAT: 'chat',
  CONVERSATION: 'conversation',
  AGENTS: 'agents',
} as const;

export type ModeValue = typeof MODE_VALUES[keyof typeof MODE_VALUES];
