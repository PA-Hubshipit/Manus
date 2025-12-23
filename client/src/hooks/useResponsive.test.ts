import { describe, it, expect } from 'vitest';
import { BREAKPOINTS, Z_INDEX, getZIndex } from './useResponsive';

// Test the exported constants and utility functions
// Hook testing would require @testing-library/react which is not installed

describe('BREAKPOINTS', () => {
  it('should have correct Tailwind breakpoint values', () => {
    expect(BREAKPOINTS.sm).toBe(640);
    expect(BREAKPOINTS.md).toBe(768);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS.xl).toBe(1280);
    expect(BREAKPOINTS['2xl']).toBe(1536);
  });

  it('should have all expected breakpoints defined', () => {
    const expectedBreakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
    expectedBreakpoints.forEach(bp => {
      expect(BREAKPOINTS).toHaveProperty(bp);
      expect(typeof BREAKPOINTS[bp as keyof typeof BREAKPOINTS]).toBe('number');
    });
  });

  it('should have breakpoints in ascending order', () => {
    expect(BREAKPOINTS.sm).toBeLessThan(BREAKPOINTS.md);
    expect(BREAKPOINTS.md).toBeLessThan(BREAKPOINTS.lg);
    expect(BREAKPOINTS.lg).toBeLessThan(BREAKPOINTS.xl);
    expect(BREAKPOINTS.xl).toBeLessThan(BREAKPOINTS['2xl']);
  });
});

describe('Z_INDEX (re-exported from z-index.ts)', () => {
  it('should have correct z-index scale values', () => {
    expect(Z_INDEX.BELOW).toBe(-1);
    expect(Z_INDEX.BASE).toBe(0);
    expect(Z_INDEX.ABOVE).toBe(50);
    expect(Z_INDEX.ELEVATED).toBe(100);
    expect(Z_INDEX.STICKY).toBe(150);
    expect(Z_INDEX.FLOATING).toBe(200);
    expect(Z_INDEX.DROPDOWN).toBe(250);
    expect(Z_INDEX.POPOVER).toBe(300);
    expect(Z_INDEX.MODAL_BACKDROP).toBe(350);
    expect(Z_INDEX.MODAL).toBe(400);
    expect(Z_INDEX.NESTED_MODAL).toBe(450);
    expect(Z_INDEX.TOAST).toBe(500);
    expect(Z_INDEX.CRITICAL).toBe(9999);
  });

  it('should maintain proper layering order', () => {
    expect(Z_INDEX.BELOW).toBeLessThan(Z_INDEX.BASE);
    expect(Z_INDEX.BASE).toBeLessThan(Z_INDEX.ABOVE);
    expect(Z_INDEX.ABOVE).toBeLessThan(Z_INDEX.ELEVATED);
    expect(Z_INDEX.ELEVATED).toBeLessThan(Z_INDEX.STICKY);
    expect(Z_INDEX.STICKY).toBeLessThan(Z_INDEX.FLOATING);
    expect(Z_INDEX.FLOATING).toBeLessThan(Z_INDEX.DROPDOWN);
    expect(Z_INDEX.DROPDOWN).toBeLessThan(Z_INDEX.POPOVER);
    expect(Z_INDEX.POPOVER).toBeLessThan(Z_INDEX.MODAL_BACKDROP);
    expect(Z_INDEX.MODAL_BACKDROP).toBeLessThan(Z_INDEX.MODAL);
    expect(Z_INDEX.MODAL).toBeLessThan(Z_INDEX.NESTED_MODAL);
    expect(Z_INDEX.NESTED_MODAL).toBeLessThan(Z_INDEX.TOAST);
    expect(Z_INDEX.TOAST).toBeLessThan(Z_INDEX.CRITICAL);
  });

  it('should have all expected layers defined', () => {
    const expectedLayers = [
      'BELOW', 'BASE', 'ABOVE', 'ELEVATED', 'STICKY', 'FLOATING',
      'DROPDOWN', 'POPOVER', 'MODAL_BACKDROP', 'MODAL', 'NESTED_MODAL',
      'TOAST', 'CRITICAL'
    ];
    expectedLayers.forEach(layer => {
      expect(Z_INDEX).toHaveProperty(layer);
      expect(typeof Z_INDEX[layer as keyof typeof Z_INDEX]).toBe('number');
    });
  });

  it('should have dropdown above floating windows', () => {
    // Dropdowns inside floating windows need to appear above them
    expect(Z_INDEX.DROPDOWN).toBeGreaterThan(Z_INDEX.FLOATING);
  });

  it('should have modal backdrop below modal content', () => {
    expect(Z_INDEX.MODAL_BACKDROP).toBeLessThan(Z_INDEX.MODAL);
  });

  it('should have toast above all modals for notifications', () => {
    expect(Z_INDEX.TOAST).toBeGreaterThan(Z_INDEX.MODAL);
    expect(Z_INDEX.TOAST).toBeGreaterThan(Z_INDEX.NESTED_MODAL);
  });
});

describe('getZIndex (re-exported from z-index.ts)', () => {
  it('should return correct z-index for each layer', () => {
    expect(getZIndex('BASE')).toBe(0);
    expect(getZIndex('FLOATING')).toBe(200);
    expect(getZIndex('DROPDOWN')).toBe(250);
    expect(getZIndex('MODAL')).toBe(400);
    expect(getZIndex('TOAST')).toBe(500);
    expect(getZIndex('CRITICAL')).toBe(9999);
  });

  it('should return the same value as direct Z_INDEX access', () => {
    const layers = [
      'BELOW', 'BASE', 'ABOVE', 'ELEVATED', 'STICKY', 'FLOATING',
      'DROPDOWN', 'POPOVER', 'MODAL_BACKDROP', 'MODAL', 'NESTED_MODAL',
      'TOAST', 'CRITICAL'
    ] as const;
    layers.forEach(layer => {
      expect(getZIndex(layer)).toBe(Z_INDEX[layer]);
    });
  });
});

describe('Z-Index Scale Compliance', () => {
  // These tests verify our z-index scale matches what we documented
  
  it('should have floating windows at z-200 as per our standard', () => {
    expect(Z_INDEX.FLOATING).toBe(200);
  });

  it('should have dropdown at z-250 as per our standard', () => {
    expect(Z_INDEX.DROPDOWN).toBe(250);
  });

  it('should have modal at z-400 as per our standard', () => {
    expect(Z_INDEX.MODAL).toBe(400);
  });

  it('should have toast at z-500 as per our standard', () => {
    expect(Z_INDEX.TOAST).toBe(500);
  });

  it('should have 50 units gap between floating and dropdown', () => {
    const gap = Z_INDEX.DROPDOWN - Z_INDEX.FLOATING;
    expect(gap).toBe(50);
  });

  it('should have 50 units gap between modal and nested modal', () => {
    const gap = Z_INDEX.NESTED_MODAL - Z_INDEX.MODAL;
    expect(gap).toBe(50);
  });

  it('should have 50 units gap between nested modal and toast', () => {
    const gap = Z_INDEX.TOAST - Z_INDEX.NESTED_MODAL;
    expect(gap).toBe(50);
  });
});
