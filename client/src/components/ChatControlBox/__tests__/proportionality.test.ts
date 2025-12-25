/**
 * ChatControlBox Proportionality Tests
 * =====================================
 * 
 * These tests verify that the proportionality system is correctly implemented
 * and that all dimensions maintain their ratios relative to the master row height.
 * 
 * REFERENCE: /home/ubuntu/multi-ai-chat/client/src/config/chatcontrolbox.config.ts
 */

import { describe, it, expect } from 'vitest';
import {
  MASTER_ROW_HEIGHT,
  RATIOS,
  COMPUTED,
  MIN_CONTAINER_WIDTH,
  getCSSVariables,
} from '@/config/chatcontrolbox.config';

describe('ChatControlBox Proportionality System', () => {
  describe('Master Dimension', () => {
    it('should have a master row height of 48px', () => {
      expect(MASTER_ROW_HEIGHT).toBe(48);
    });

    it('should be a positive integer', () => {
      expect(MASTER_ROW_HEIGHT).toBeGreaterThan(0);
      expect(Number.isInteger(MASTER_ROW_HEIGHT)).toBe(true);
    });
  });

  describe('Ratios', () => {
    it('should have toolbar icon ratio of 0.5 (50% of row height)', () => {
      expect(RATIOS.toolbarIcon).toBe(0.5);
    });

    it('should have toolbar icon button ratio of 0.833 (83.3% of row height)', () => {
      expect(RATIOS.toolbarIconButton).toBe(0.833);
    });

    it('should have input icon ratio smaller than toolbar icon', () => {
      expect(RATIOS.inputIcon).toBeLessThan(RATIOS.toolbarIcon);
    });

    it('should have send icon ratio smaller than input icon', () => {
      expect(RATIOS.sendIcon).toBeLessThan(RATIOS.inputIcon);
    });

    it('should have all ratios between 0 and 3', () => {
      expect(RATIOS.toolbarIcon).toBeGreaterThan(0);
      expect(RATIOS.toolbarIcon).toBeLessThan(3);
      expect(RATIOS.inputIcon).toBeGreaterThan(0);
      expect(RATIOS.inputIcon).toBeLessThan(3);
      expect(RATIOS.sendIcon).toBeGreaterThan(0);
      expect(RATIOS.sendIcon).toBeLessThan(3);
      expect(RATIOS.toolbarIconButton).toBeGreaterThan(0);
      expect(RATIOS.toolbarIconButton).toBeLessThan(3);
      expect(RATIOS.modelsButton.height).toBeGreaterThan(0);
      expect(RATIOS.modelsButton.height).toBeLessThan(3);
      expect(RATIOS.modelsButton.minWidth).toBeGreaterThan(0);
      expect(RATIOS.modelsButton.minWidth).toBeLessThan(3);
    });
  });

  describe('Computed Values', () => {
    it('should compute toolbar icon size correctly', () => {
      const expected = Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarIcon);
      expect(COMPUTED.toolbarIconSize).toBe(expected);
      expect(COMPUTED.toolbarIconSize).toBe(24); // 48 * 0.5 = 24
    });

    it('should compute toolbar icon button size correctly', () => {
      const expected = Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarIconButton);
      expect(COMPUTED.toolbarIconButtonSize).toBe(expected);
      expect(COMPUTED.toolbarIconButtonSize).toBe(40); // 48 * 0.833 ≈ 40
    });

    it('should compute input icon size correctly', () => {
      const expected = Math.round(MASTER_ROW_HEIGHT * RATIOS.inputIcon);
      expect(COMPUTED.inputIconSize).toBe(expected);
      expect(COMPUTED.inputIconSize).toBe(22); // 48 * 0.458 ≈ 22
    });

    it('should compute send icon size correctly', () => {
      const expected = Math.round(MASTER_ROW_HEIGHT * RATIOS.sendIcon);
      expect(COMPUTED.sendIconSize).toBe(expected);
      expect(COMPUTED.sendIconSize).toBe(20); // 48 * 0.417 ≈ 20
    });

    it('should compute models button dimensions correctly', () => {
      expect(COMPUTED.modelsButtonHeight).toBe(40); // 48 * 0.833 ≈ 40
      expect(COMPUTED.modelsButtonMinWidth).toBe(100); // 48 * 2.083 ≈ 100
    });

    it('should compute presets button dimensions correctly', () => {
      expect(COMPUTED.presetsButtonHeight).toBe(40); // 48 * 0.833 ≈ 40
      expect(COMPUTED.presetsButtonMinWidth).toBe(90); // 48 * 1.875 = 90
    });

    it('should compute send button size correctly', () => {
      expect(COMPUTED.sendButtonSize).toBe(36); // 48 * 0.75 = 36
    });

    it('should compute spacing values correctly', () => {
      expect(COMPUTED.toolbarGap).toBe(12); // 48 * 0.25 = 12
      expect(COMPUTED.rowGap).toBe(12); // 48 * 0.25 = 12
      expect(COMPUTED.containerPadding).toBe(16); // 48 * 0.333 ≈ 16
      expect(COMPUTED.containerPaddingY).toBe(12); // 48 * 0.25 = 12
    });

    it('should compute input field dimensions correctly', () => {
      expect(COMPUTED.inputHeight).toBe(44); // 48 * 0.917 ≈ 44
      expect(COMPUTED.inputBorderRadius).toBe(22); // 48 * 0.458 ≈ 22
      expect(COMPUTED.inputPaddingX).toBe(16); // 48 * 0.333 ≈ 16
    });

    it('should compute container border radius correctly', () => {
      expect(COMPUTED.containerBorderRadius).toBe(16); // 48 * 0.333 ≈ 16
    });

    it('should compute font sizes correctly', () => {
      expect(COMPUTED.fontSize).toBe(14); // 48 * 0.292 ≈ 14
      expect(COMPUTED.fontSizeSmall).toBe(12); // 48 * 0.25 = 12
    });
  });

  describe('Minimum Container Width', () => {
    it('should calculate minimum width to fit all toolbar items', () => {
      // 5 icon buttons + Models button + Presets button + 6 gaps + 2 padding
      const expected = 
        (COMPUTED.toolbarIconButtonSize * 5) +
        COMPUTED.modelsButtonMinWidth +
        COMPUTED.presetsButtonMinWidth +
        (COMPUTED.toolbarGap * 6) +
        (COMPUTED.containerPadding * 2);
      
      expect(MIN_CONTAINER_WIDTH).toBe(expected);
    });

    it('should be at least 350px to ensure usability', () => {
      expect(MIN_CONTAINER_WIDTH).toBeGreaterThanOrEqual(350);
    });

    it('should be less than 500px to fit in narrow containers', () => {
      expect(MIN_CONTAINER_WIDTH).toBeLessThan(500);
    });
  });

  describe('CSS Variables Generator', () => {
    it('should generate all required CSS variables', () => {
      const vars = getCSSVariables();
      
      expect(vars).toHaveProperty('--ccb-row-height');
      expect(vars).toHaveProperty('--ccb-toolbar-icon-size');
      expect(vars).toHaveProperty('--ccb-input-icon-size');
      expect(vars).toHaveProperty('--ccb-send-icon-size');
      expect(vars).toHaveProperty('--ccb-toolbar-icon-button-size');
      expect(vars).toHaveProperty('--ccb-models-button-height');
      expect(vars).toHaveProperty('--ccb-models-button-min-width');
      expect(vars).toHaveProperty('--ccb-presets-button-height');
      expect(vars).toHaveProperty('--ccb-presets-button-min-width');
      expect(vars).toHaveProperty('--ccb-send-button-size');
      expect(vars).toHaveProperty('--ccb-toolbar-gap');
      expect(vars).toHaveProperty('--ccb-row-gap');
      expect(vars).toHaveProperty('--ccb-container-padding');
      expect(vars).toHaveProperty('--ccb-container-padding-y');
      expect(vars).toHaveProperty('--ccb-input-height');
      expect(vars).toHaveProperty('--ccb-input-border-radius');
      expect(vars).toHaveProperty('--ccb-input-padding-x');
      expect(vars).toHaveProperty('--ccb-container-border-radius');
      expect(vars).toHaveProperty('--ccb-font-size');
      expect(vars).toHaveProperty('--ccb-font-size-small');
      expect(vars).toHaveProperty('--ccb-min-width');
    });

    it('should generate correct pixel values in CSS format', () => {
      const vars = getCSSVariables();
      
      expect(vars['--ccb-row-height']).toBe('48px');
      expect(vars['--ccb-toolbar-icon-size']).toBe('24px');
      expect(vars['--ccb-toolbar-icon-button-size']).toBe('40px');
      expect(vars['--ccb-min-width']).toBe(`${MIN_CONTAINER_WIDTH}px`);
    });
  });

  describe('Proportionality Relationships', () => {
    it('should maintain icon < button size relationship', () => {
      expect(COMPUTED.toolbarIconSize).toBeLessThan(COMPUTED.toolbarIconButtonSize);
    });

    it('should maintain toolbar icon > input icon > send icon hierarchy', () => {
      expect(COMPUTED.toolbarIconSize).toBeGreaterThan(COMPUTED.inputIconSize);
      expect(COMPUTED.inputIconSize).toBeGreaterThan(COMPUTED.sendIconSize);
    });

    it('should have models and presets buttons at same height', () => {
      expect(COMPUTED.modelsButtonHeight).toBe(COMPUTED.presetsButtonHeight);
    });

    it('should have input height close to row height', () => {
      const ratio = COMPUTED.inputHeight / COMPUTED.rowHeight;
      expect(ratio).toBeGreaterThan(0.9);
      expect(ratio).toBeLessThanOrEqual(1);
    });

    it('should have input border radius equal to half input height (full round)', () => {
      expect(COMPUTED.inputBorderRadius).toBe(Math.round(COMPUTED.inputHeight / 2));
    });
  });

  describe('Scaling Behavior', () => {
    it('should scale all values proportionally when master dimension changes', () => {
      // Simulate a 50% scale
      const scaleFactor = 1.5;
      const scaledRowHeight = MASTER_ROW_HEIGHT * scaleFactor;
      
      // All ratios should produce proportionally scaled values
      const scaledToolbarIcon = Math.round(scaledRowHeight * RATIOS.toolbarIcon);
      const scaledToolbarButton = Math.round(scaledRowHeight * RATIOS.toolbarIconButton);
      
      // Verify the ratio is preserved
      expect(scaledToolbarIcon / scaledToolbarButton).toBeCloseTo(
        COMPUTED.toolbarIconSize / COMPUTED.toolbarIconButtonSize,
        1
      );
    });
  });
});

describe('Anti-Pattern Prevention', () => {
  it('should not have any hardcoded pixel values in RATIOS', () => {
    // All values in RATIOS should be ratios (0 < x < 10), not pixel values
    const checkRatio = (value: number, name: string) => {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(10);
    };

    checkRatio(RATIOS.toolbarIcon, 'toolbarIcon');
    checkRatio(RATIOS.inputIcon, 'inputIcon');
    checkRatio(RATIOS.sendIcon, 'sendIcon');
    checkRatio(RATIOS.toolbarIconButton, 'toolbarIconButton');
    checkRatio(RATIOS.modelsButton.height, 'modelsButton.height');
    checkRatio(RATIOS.modelsButton.minWidth, 'modelsButton.minWidth');
    checkRatio(RATIOS.presetsButton.height, 'presetsButton.height');
    checkRatio(RATIOS.presetsButton.minWidth, 'presetsButton.minWidth');
    checkRatio(RATIOS.sendButton, 'sendButton');
    checkRatio(RATIOS.toolbarGap, 'toolbarGap');
    checkRatio(RATIOS.rowGap, 'rowGap');
    checkRatio(RATIOS.containerPadding, 'containerPadding');
    checkRatio(RATIOS.containerPaddingY, 'containerPaddingY');
    checkRatio(RATIOS.inputHeight, 'inputHeight');
    checkRatio(RATIOS.inputBorderRadius, 'inputBorderRadius');
    checkRatio(RATIOS.inputPaddingX, 'inputPaddingX');
    checkRatio(RATIOS.containerBorderRadius, 'containerBorderRadius');
    checkRatio(RATIOS.fontSize, 'fontSize');
    checkRatio(RATIOS.fontSizeSmall, 'fontSizeSmall');
  });

  it('should derive all COMPUTED values from MASTER_ROW_HEIGHT and RATIOS', () => {
    // Verify each computed value is derived correctly
    expect(COMPUTED.rowHeight).toBe(MASTER_ROW_HEIGHT);
    expect(COMPUTED.toolbarIconSize).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarIcon));
    expect(COMPUTED.inputIconSize).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.inputIcon));
    expect(COMPUTED.sendIconSize).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.sendIcon));
    expect(COMPUTED.toolbarIconButtonSize).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarIconButton));
    expect(COMPUTED.modelsButtonHeight).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.modelsButton.height));
    expect(COMPUTED.modelsButtonMinWidth).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.modelsButton.minWidth));
    expect(COMPUTED.presetsButtonHeight).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.presetsButton.height));
    expect(COMPUTED.presetsButtonMinWidth).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.presetsButton.minWidth));
    expect(COMPUTED.sendButtonSize).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.sendButton));
    expect(COMPUTED.toolbarGap).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.toolbarGap));
    expect(COMPUTED.rowGap).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.rowGap));
    expect(COMPUTED.containerPadding).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.containerPadding));
    expect(COMPUTED.containerPaddingY).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.containerPaddingY));
    expect(COMPUTED.inputHeight).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.inputHeight));
    expect(COMPUTED.inputBorderRadius).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.inputBorderRadius));
    expect(COMPUTED.inputPaddingX).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.inputPaddingX));
    expect(COMPUTED.containerBorderRadius).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.containerBorderRadius));
    expect(COMPUTED.fontSize).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.fontSize));
    expect(COMPUTED.fontSizeSmall).toBe(Math.round(MASTER_ROW_HEIGHT * RATIOS.fontSizeSmall));
  });
});
