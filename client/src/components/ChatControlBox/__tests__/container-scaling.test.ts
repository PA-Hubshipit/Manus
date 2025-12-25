/**
 * ChatControlBox Container-Based Scaling Tests
 * =============================================
 * 
 * Tests for the container-based responsive scaling system.
 * Verifies that the scaling functions correctly calculate scale factors
 * and CSS variables based on container width.
 */

import { describe, it, expect } from 'vitest';
import { 
  calculateScaleFactor, 
  getScaledCSSVariables, 
  MIN_CONTAINER_WIDTH,
  MASTER_ROW_HEIGHT 
} from '@/config/chatcontrolbox.config';

describe('Container-Based Scaling System', () => {
  describe('calculateScaleFactor', () => {
    it('should return 1.0 when container width equals MIN_CONTAINER_WIDTH', () => {
      const scaleFactor = calculateScaleFactor(MIN_CONTAINER_WIDTH);
      expect(scaleFactor).toBe(1.0);
    });

    it('should return 1.0 when container width is larger than MIN_CONTAINER_WIDTH', () => {
      const scaleFactor = calculateScaleFactor(MIN_CONTAINER_WIDTH + 100);
      expect(scaleFactor).toBe(1.0);
    });

    it('should return a value less than 1.0 when container width is smaller than MIN_CONTAINER_WIDTH', () => {
      const scaleFactor = calculateScaleFactor(MIN_CONTAINER_WIDTH - 50);
      expect(scaleFactor).toBeLessThan(1.0);
      expect(scaleFactor).toBeGreaterThan(0);
    });

    it('should return minimum scale factor of 0.5 for very small containers', () => {
      const scaleFactor = calculateScaleFactor(100); // Very small container
      expect(scaleFactor).toBe(0.5);
    });

    it('should calculate correct scale factor for typical mobile widths', () => {
      // 320px container
      const scaleFactor320 = calculateScaleFactor(320);
      expect(scaleFactor320).toBeCloseTo(320 / MIN_CONTAINER_WIDTH, 2);
      
      // 360px container
      const scaleFactor360 = calculateScaleFactor(360);
      if (360 >= MIN_CONTAINER_WIDTH) {
        expect(scaleFactor360).toBe(1.0);
      } else {
        expect(scaleFactor360).toBeCloseTo(360 / MIN_CONTAINER_WIDTH, 2);
      }
    });
  });

  describe('getScaledCSSVariables', () => {
    it('should return full-size CSS variables when container is at MIN_CONTAINER_WIDTH', () => {
      const cssVars = getScaledCSSVariables(MIN_CONTAINER_WIDTH);
      expect(cssVars['--ccb-row-height']).toBe(`${MASTER_ROW_HEIGHT}px`);
    });

    it('should return scaled CSS variables when container is smaller', () => {
      const smallWidth = MIN_CONTAINER_WIDTH * 0.8;
      const cssVars = getScaledCSSVariables(smallWidth);
      
      // Row height should be scaled down
      const expectedRowHeight = Math.round(MASTER_ROW_HEIGHT * 0.8);
      expect(cssVars['--ccb-row-height']).toBe(`${expectedRowHeight}px`);
    });

    it('should include scale factor in CSS variables', () => {
      const cssVars = getScaledCSSVariables(MIN_CONTAINER_WIDTH * 0.75);
      expect(cssVars['--ccb-scale-factor']).toBeDefined();
      expect(parseFloat(cssVars['--ccb-scale-factor'] as string)).toBeCloseTo(0.75, 2);
    });

    it('should set min-width to 0px when scaling', () => {
      const cssVars = getScaledCSSVariables(300);
      expect(cssVars['--ccb-min-width']).toBe('0px');
    });

    it('should maintain proportional ratios in scaled variables', () => {
      const cssVars = getScaledCSSVariables(MIN_CONTAINER_WIDTH * 0.8);
      
      const rowHeight = parseInt((cssVars['--ccb-row-height'] as string).replace('px', ''));
      const toolbarIconSize = parseInt((cssVars['--ccb-toolbar-icon-size'] as string).replace('px', ''));
      
      // Toolbar icon should be ~50% of row height
      const ratio = toolbarIconSize / rowHeight;
      expect(ratio).toBeCloseTo(0.5, 1);
    });
  });

  describe('Scaling Behavior at Different Container Widths', () => {
    const testWidths = [280, 320, 360, 400, 450, 500, 600];
    
    testWidths.forEach(width => {
      it(`should produce valid CSS variables for ${width}px container`, () => {
        const cssVars = getScaledCSSVariables(width);
        
        // All required variables should be present
        expect(cssVars['--ccb-row-height']).toBeDefined();
        expect(cssVars['--ccb-toolbar-icon-size']).toBeDefined();
        expect(cssVars['--ccb-toolbar-icon-button-size']).toBeDefined();
        expect(cssVars['--ccb-toolbar-gap']).toBeDefined();
        expect(cssVars['--ccb-models-button-height']).toBeDefined();
        expect(cssVars['--ccb-presets-button-height']).toBeDefined();
        
        // Values should be positive
        const rowHeight = parseInt((cssVars['--ccb-row-height'] as string).replace('px', ''));
        expect(rowHeight).toBeGreaterThan(0);
        expect(rowHeight).toBeLessThanOrEqual(MASTER_ROW_HEIGHT);
      });
    });
  });

  describe('Minimum Usability Constraints', () => {
    it('should maintain minimum row height of 24px even at 0.5 scale factor', () => {
      const cssVars = getScaledCSSVariables(100); // Will trigger 0.5 scale factor
      const rowHeight = parseInt((cssVars['--ccb-row-height'] as string).replace('px', ''));
      
      // At 0.5 scale, row height = 48 * 0.5 = 24px
      expect(rowHeight).toBeGreaterThanOrEqual(24);
    });

    it('should maintain readable font size at minimum scale', () => {
      const cssVars = getScaledCSSVariables(100); // Will trigger 0.5 scale factor
      const fontSize = parseInt((cssVars['--ccb-font-size'] as string).replace('px', ''));
      
      // Font size should be at least 7px for readability
      expect(fontSize).toBeGreaterThanOrEqual(7);
    });
  });
});
