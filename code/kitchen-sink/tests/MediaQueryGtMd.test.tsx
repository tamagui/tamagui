import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

/**
 * Regression test for media query bug starting in 1.132.17
 *
 * Bug: On small screens, $gtMd styles incorrectly apply.
 * The compiler is generating incorrect output where $gtMd overrides $md
 * even when the viewport is below the $gtMd breakpoint.
 *
 * Adding debug="verbose" fixes it, confirming compiler issue.
 */

test.describe('Media Query $gtMd regression', () => {
  test.describe('Small viewport (mobile - below md breakpoint)', () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, { name: 'MediaQueryGtMd', type: 'useCase' })
      // Set viewport to small size (below md breakpoint of 660px)
      await page.setViewportSize({ width: 500, height: 800 })
    })

    test('$md should apply, NOT $gtMd on small screens', async ({ page }) => {
      // Test 1: Both $md and $gtMd - $md should win on small screen
      const test1 = page.locator('#media-test-both')
      const styles1 = await getStyles(test1)
      expect(styles1.backgroundColor).toBe('rgb(255, 255, 0)') // yellow from $md, NOT green from $gtMd
    })

    test('$gtMd should NOT apply on small screens', async ({ page }) => {
      // Test 2: Only $gtMd - should stay red (base) on small screen
      const test2 = page.locator('#media-test-gtmd-only')
      const styles2 = await getStyles(test2)
      expect(styles2.backgroundColor).toBe('rgb(255, 0, 0)') // red (base), $gtMd should NOT apply
    })

    test('$md should apply on small screens', async ({ page }) => {
      // Test 3: Only $md - should be yellow on small screen
      const test3 = page.locator('#media-test-md-only')
      const styles3 = await getStyles(test3)
      expect(styles3.backgroundColor).toBe('rgb(255, 255, 0)') // yellow from $md
    })

    test('$sm should apply on extra small screens', async ({ page }) => {
      // Set to very small viewport to test $sm
      await page.setViewportSize({ width: 400, height: 800 })

      // Test 4: $sm, $md, $gtMd together - $sm should win on extra small
      const test4 = page.locator('#media-test-all')
      const styles4 = await getStyles(test4)
      expect(styles4.backgroundColor).toBe('rgb(0, 0, 255)') // blue from $sm
    })
  })

  test.describe('Large viewport (desktop - above gtMd breakpoint)', () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, { name: 'MediaQueryGtMd', type: 'useCase' })
      // Set viewport to large size (above gtMd breakpoint of 1021px)
      await page.setViewportSize({ width: 1100, height: 800 })
    })

    test('$gtMd should apply on large screens', async ({ page }) => {
      // Test 1: Both $md and $gtMd - $gtMd should win on large screen
      const test1 = page.locator('#media-test-both')
      const styles1 = await getStyles(test1)
      expect(styles1.backgroundColor).toBe('rgb(0, 128, 0)') // green from $gtMd
    })

    test('$gtMd should apply when only $gtMd is set', async ({ page }) => {
      // Test 2: Only $gtMd - should be green on large screen
      const test2 = page.locator('#media-test-gtmd-only')
      const styles2 = await getStyles(test2)
      expect(styles2.backgroundColor).toBe('rgb(0, 128, 0)') // green from $gtMd
    })

    test('all three media queries - $gtMd wins on large screen', async ({ page }) => {
      // Test 4: $sm, $md, $gtMd together - $gtMd should win on large screen
      const test4 = page.locator('#media-test-all')
      const styles4 = await getStyles(test4)
      expect(styles4.backgroundColor).toBe('rgb(0, 128, 0)') // green from $gtMd
    })
  })
})
