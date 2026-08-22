import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

/**
 * Regression test for a media query bug starting in 1.132.17
 *
 * Bug: on small screens the min-width styles incorrectly applied. The compiler
 * generated output where the min-width query overrode the max-width one even
 * below the breakpoint.
 *
 * Adding debug="verbose" fixed it, confirming a compiler issue.
 */

test.describe('Media query min/max boundary regression', () => {
  test.describe('Small viewport (mobile - below the md breakpoint)', () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, { name: 'MediaQueryGtMd', type: 'useCase' })
      // Set viewport to small size (below the md breakpoint of 768px)
      await page.setViewportSize({ width: 700, height: 800 })
    })

    test('max-md should apply, NOT md on small screens', async ({ page }) => {
      // Test 1: Both max-md and md - max-md should win on small screen
      const test1 = page.locator('#media-test-both')
      const styles1 = await getStyles(test1)
      expect(styles1.backgroundColor).toBe('rgb(255, 255, 0)') // yellow from max-md, NOT green from md
    })

    test('md should NOT apply on small screens', async ({ page }) => {
      // Test 2: Only md - should stay red (base) on small screen
      const test2 = page.locator('#media-test-md-only')
      const styles2 = await getStyles(test2)
      expect(styles2.backgroundColor).toBe('rgb(255, 0, 0)') // red (base), md should NOT apply
    })

    test('max-md should apply on small screens', async ({ page }) => {
      // Test 3: Only max-md - should be yellow on small screen
      const test3 = page.locator('#media-test-max-md-only')
      const styles3 = await getStyles(test3)
      expect(styles3.backgroundColor).toBe('rgb(255, 255, 0)') // yellow from max-md
    })

    test('max-sm should win on extra small screens', async ({ page }) => {
      // Set to very small viewport to test max-sm
      await page.setViewportSize({ width: 400, height: 800 })

      // Test 4: max-sm, max-md, md together - max-sm is declared last and wins
      const test4 = page.locator('#media-test-all')
      const styles4 = await getStyles(test4)
      expect(styles4.backgroundColor).toBe('rgb(0, 0, 255)') // blue from max-sm
    })
  })

  test.describe('Large viewport (desktop - above the md breakpoint)', () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, { name: 'MediaQueryGtMd', type: 'useCase' })
      // Set viewport to large size (above the md breakpoint of 768px)
      await page.setViewportSize({ width: 1100, height: 800 })
    })

    test('md should apply on large screens', async ({ page }) => {
      // Test 1: Both max-md and md - md should win on large screen
      const test1 = page.locator('#media-test-both')
      const styles1 = await getStyles(test1)
      expect(styles1.backgroundColor).toBe('rgb(0, 128, 0)') // green from md
    })

    test('md should apply when only md is set', async ({ page }) => {
      // Test 2: Only md - should be green on large screen
      const test2 = page.locator('#media-test-md-only')
      const styles2 = await getStyles(test2)
      expect(styles2.backgroundColor).toBe('rgb(0, 128, 0)') // green from md
    })

    test('all three media queries - md wins on large screen', async ({ page }) => {
      // Test 4: max-sm, max-md, md together - md should win on large screen
      const test4 = page.locator('#media-test-all')
      const styles4 = await getStyles(test4)
      expect(styles4.backgroundColor).toBe('rgb(0, 128, 0)') // green from md
    })
  })
})
