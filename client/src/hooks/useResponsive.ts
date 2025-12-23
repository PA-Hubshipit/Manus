/**
 * useResponsive Hook - Complete Responsive Design Utilities
 * ==========================================================
 * 
 * This hook provides all the utilities needed for responsive design:
 * - Viewport detection (width, height, orientation)
 * - Breakpoint utilities (isAbove, isBelow, isBetween)
 * - Device type detection (mobile, tablet, desktop)
 * - Touch device detection
 * - Z-index constants (re-exported from z-index.ts)
 * 
 * USAGE:
 * ```tsx
 * const { isMobile, isAbove, viewport } = useResponsive();
 * 
 * if (isMobile) {
 *   // Render mobile-specific UI
 * }
 * 
 * if (isAbove('md')) {
 *   // Render for screens >= 768px
 * }
 * ```
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// Re-export z-index utilities for convenience
export { 
  Z_INDEX, 
  Z_CLASS, 
  getZIndex, 
  getZIndexClass, 
  getZIndexStyle, 
  COMPONENT_Z_INDEX,
  isValidZIndex,
  getLayerName,
  type ZIndexLayer,
  type ZIndexValue,
} from '@/lib/z-index';

// =============================================================================
// BREAKPOINT DEFINITIONS
// =============================================================================

/**
 * Tailwind CSS default breakpoints.
 * These match Tailwind's default configuration.
 */
export const BREAKPOINTS = {
  sm: 640,   // Small devices (landscape phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (desktops)
  xl: 1280,  // Extra large devices (large desktops)
  '2xl': 1536, // 2X large devices (larger desktops)
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// =============================================================================
// DEVICE TYPE DEFINITIONS
// =============================================================================

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

// =============================================================================
// VIEWPORT STATE INTERFACE
// =============================================================================

export interface ViewportState {
  /** Current viewport width in pixels */
  width: number;
  /** Current viewport height in pixels */
  height: number;
  /** Current device orientation */
  orientation: Orientation;
  /** Whether the device supports touch */
  isTouch: boolean;
}

// =============================================================================
// HOOK RETURN TYPE
// =============================================================================

export interface UseResponsiveReturn {
  // Viewport state
  viewport: ViewportState;
  
  // Device type booleans
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  
  // Breakpoint utilities
  isAbove: (breakpoint: Breakpoint) => boolean;
  isBelow: (breakpoint: Breakpoint) => boolean;
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean;
  currentBreakpoint: Breakpoint | null;
  
  // Touch detection
  isTouch: boolean;
  
  // Orientation
  isPortrait: boolean;
  isLandscape: boolean;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the current viewport dimensions.
 * Works in both browser and SSR environments.
 */
function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Detect if the device supports touch.
 */
function detectTouch(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - msMaxTouchPoints is IE-specific
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Get the current orientation based on viewport dimensions.
 */
function getOrientation(width: number, height: number): Orientation {
  return width >= height ? 'landscape' : 'portrait';
}

/**
 * Determine device type based on viewport width.
 */
function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.md) {
    return 'mobile';
  }
  if (width < BREAKPOINTS.lg) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Get the current breakpoint based on viewport width.
 */
function getCurrentBreakpoint(width: number): Breakpoint | null {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return null; // Below smallest breakpoint
}

// =============================================================================
// MAIN HOOK
// =============================================================================

/**
 * useResponsive - Complete responsive design utilities hook.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isMobile, isAbove, viewport } = useResponsive();
 *   
 *   return (
 *     <div>
 *       {isMobile ? <MobileNav /> : <DesktopNav />}
 *       {isAbove('lg') && <Sidebar />}
 *       <p>Viewport: {viewport.width}x{viewport.height}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useResponsive(): UseResponsiveReturn {
  // Initialize state with current viewport
  const [viewport, setViewport] = useState<ViewportState>(() => {
    const { width, height } = getViewportDimensions();
    return {
      width,
      height,
      orientation: getOrientation(width, height),
      isTouch: detectTouch(),
    };
  });

  // Update viewport on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      // Debounce resize events for performance
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { width, height } = getViewportDimensions();
        setViewport({
          width,
          height,
          orientation: getOrientation(width, height),
          isTouch: detectTouch(),
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    // Also listen for orientation change on mobile
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Memoized breakpoint utilities
  const isAbove = useCallback(
    (breakpoint: Breakpoint): boolean => {
      return viewport.width >= BREAKPOINTS[breakpoint];
    },
    [viewport.width]
  );

  const isBelow = useCallback(
    (breakpoint: Breakpoint): boolean => {
      return viewport.width < BREAKPOINTS[breakpoint];
    },
    [viewport.width]
  );

  const isBetween = useCallback(
    (min: Breakpoint, max: Breakpoint): boolean => {
      return viewport.width >= BREAKPOINTS[min] && viewport.width < BREAKPOINTS[max];
    },
    [viewport.width]
  );

  // Memoized computed values
  const computed = useMemo(() => {
    const deviceType = getDeviceType(viewport.width);
    const currentBreakpoint = getCurrentBreakpoint(viewport.width);
    
    return {
      deviceType,
      currentBreakpoint,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isPortrait: viewport.orientation === 'portrait',
      isLandscape: viewport.orientation === 'landscape',
    };
  }, [viewport.width, viewport.orientation]);

  return {
    viewport,
    ...computed,
    isAbove,
    isBelow,
    isBetween,
    isTouch: viewport.isTouch,
  };
}

// =============================================================================
// SINGLE BREAKPOINT HOOK
// =============================================================================

/**
 * Hook for checking a single breakpoint.
 * More performant than useResponsive when you only need one check.
 * 
 * @example
 * ```tsx
 * const isLargeScreen = useBreakpoint('lg', 'above');
 * const isMobileOnly = useBreakpoint('md', 'below');
 * ```
 */
export function useBreakpoint(
  breakpoint: Breakpoint,
  direction: 'above' | 'below' = 'above'
): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return direction === 'above';
    const width = window.innerWidth;
    return direction === 'above'
      ? width >= BREAKPOINTS[breakpoint]
      : width < BREAKPOINTS[breakpoint];
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      direction === 'above'
        ? `(min-width: ${BREAKPOINTS[breakpoint]}px)`
        : `(max-width: ${BREAKPOINTS[breakpoint] - 1}px)`
    );

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint, direction]);

  return matches;
}

// =============================================================================
// TOUCH HANDLERS HOOK
// =============================================================================

/**
 * Hook for touch-friendly event handling.
 * Returns handlers that work for both mouse and touch.
 * 
 * @example
 * ```tsx
 * const { handlers, isPressed } = useTouchHandlers({
 *   onPress: () => console.log('pressed'),
 *   onRelease: () => console.log('released'),
 * });
 * 
 * return <button {...handlers}>Click me</button>;
 * ```
 */
export function useTouchHandlers(options: {
  onPress?: () => void;
  onRelease?: () => void;
  onLongPress?: () => void;
  longPressDelay?: number;
}) {
  const { onPress, onRelease, onLongPress, longPressDelay = 500 } = options;
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useMemo(() => ({ current: null as ReturnType<typeof setTimeout> | null }), []);

  const handleStart = useCallback(() => {
    setIsPressed(true);
    onPress?.();

    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
      }, longPressDelay);
    }
  }, [onPress, onLongPress, longPressDelay, longPressTimer]);

  const handleEnd = useCallback(() => {
    setIsPressed(false);
    onRelease?.();

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, [onRelease, longPressTimer]);

  const handlers = useMemo(
    () => ({
      onMouseDown: handleStart,
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart: handleStart,
      onTouchEnd: handleEnd,
      onTouchCancel: handleEnd,
    }),
    [handleStart, handleEnd]
  );

  return { handlers, isPressed };
}

// =============================================================================
// STANDALONE UTILITIES (for use outside React components)
// =============================================================================

/**
 * Check if the current viewport is above a breakpoint.
 * For use outside React components.
 */
export function checkIsAbove(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= BREAKPOINTS[breakpoint];
}

/**
 * Check if the current viewport is below a breakpoint.
 * For use outside React components.
 */
export function checkIsBelow(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth < BREAKPOINTS[breakpoint];
}

/**
 * Get the current device type.
 * For use outside React components.
 */
export function checkDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  return getDeviceType(window.innerWidth);
}

/**
 * Check if the device is a touch device.
 * For use outside React components.
 */
export function checkIsTouch(): boolean {
  return detectTouch();
}

// =============================================================================
// SWIPE GESTURE UTILITIES
// =============================================================================

export interface TouchHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance to trigger swipe (default: 50px)
}

/**
 * Create touch handlers for swipe gestures.
 * 
 * @example
 * ```tsx
 * const touchHandlers = createSwipeHandlers({
 *   onSwipeLeft: () => closeDrawer(),
 *   onSwipeRight: () => openDrawer(),
 * });
 * 
 * return <div {...touchHandlers}>Swipeable content</div>;
 * ```
 */
export function createSwipeHandlers(config: SwipeConfig): TouchHandlers {
  const threshold = config.threshold ?? 50;
  let startX = 0;
  let startY = 0;

  return {
    onTouchStart: (e: React.TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    onTouchMove: () => {
      // Optional: Add visual feedback during swipe
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      // Determine if horizontal or vertical swipe
      if (absX > absY && absX > threshold) {
        if (deltaX > 0) {
          config.onSwipeRight?.();
        } else {
          config.onSwipeLeft?.();
        }
      } else if (absY > absX && absY > threshold) {
        if (deltaY > 0) {
          config.onSwipeDown?.();
        } else {
          config.onSwipeUp?.();
        }
      }
    },
  };
}

// =============================================================================
// CSS MEDIA QUERY HELPERS
// =============================================================================

/**
 * Generate a CSS media query string for a breakpoint.
 * Useful for CSS-in-JS solutions.
 */
export function mediaQuery(breakpoint: Breakpoint, type: 'min' | 'max' = 'min'): string {
  const value = type === 'min' ? BREAKPOINTS[breakpoint] : BREAKPOINTS[breakpoint] - 1;
  return `@media (${type}-width: ${value}px)`;
}

/**
 * Generate a CSS media query string for a range between breakpoints.
 */
export function mediaQueryBetween(min: Breakpoint, max: Breakpoint): string {
  return `@media (min-width: ${BREAKPOINTS[min]}px) and (max-width: ${BREAKPOINTS[max] - 1}px)`;
}

// Default export for convenience
export default useResponsive;
