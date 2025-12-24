import { test, expect } from '@playwright/test';

/**
 * Basic Playwright Test
 * =====================
 * 
 * Simple test to verify Playwright is working correctly.
 */

test.describe('Basic Tests', () => {
  test('page loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Verify page has content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
