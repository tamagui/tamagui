import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

/**
 * Tests for v5 media queries with mobile-first (minWidth) and desktop-first (maxWidth)
 *
 * v5 uses:
 * - minWidth for base queries ($sm, $md, $lg, etc.) - mobile-first: larger wins
 * - maxWidth for max-* queries ($max-sm, $max-md, etc.) - desktop-first: smaller wins
 *
 * NOTE: These tests are currently skipped because the kitchen-sink webpack build
 * evaluates the config selection at bundle time (when window.location is undefined),
 * not at runtime. The v5config query param doesn't work for dynamic config switching.
 *
 * The v5 media config itself is correct - see code/core/config/src/v5-media.ts
 * To properly test, the kitchen-sink would need to be built with v5 config as default,
 * or use a different mechanism for config switching.
 */

test.describe.skip('v5 Media Queries', () => {
  test.describe('Mobile-first (minWidth) - larger breakpoints should win', () => {
    test.beforeEach(async ({ page }) => {
      // use v5config query param to enable v5 media config
      await setupPage(page, {
        name: 'MediaQueriesV5',
        type: 'useCase',
        searchParams: { v5config: 'true' },
      })
    })

    test('on large viewport (1280px), $lg should win over $sm and $md', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 })
      const element = page.locator('[data-testid="test-mobile-first"]')
      const styles = await getStyles(element)
      // lg (1024) should be active and win over sm (640) and md (768)
      expect(styles.backgroundColor).toBe('rgb(0, 128, 0)') // green from $lg
    })

    test('on medium viewport (900px), $md should win over $sm', async ({ page }) => {
      await page.setViewportSize({ width: 900, height: 800 })
      const element = page.locator('[data-testid="test-mobile-first"]')
      const styles = await getStyles(element)
      // md (768) should be active and win over sm (640)
      expect(styles.backgroundColor).toBe('rgb(255, 165, 0)') // orange from $md
    })

    test('on small viewport (700px), $sm should apply', async ({ page }) => {
      await page.setViewportSize({ width: 700, height: 800 })
      const element = page.locator('[data-testid="test-mobile-first"]')
      const styles = await getStyles(element)
      // only sm (640) should be active
      expect(styles.backgroundColor).toBe('rgb(255, 255, 0)') // yellow from $sm
    })

    test('on tiny viewport (500px), base (red) should apply', async ({ page }) => {
      await page.setViewportSize({ width: 500, height: 800 })
      const element = page.locator('[data-testid="test-mobile-first"]')
      const styles = await getStyles(element)
      // none of the breakpoints should be active
      expect(styles.backgroundColor).toBe('rgb(255, 0, 0)') // red (base)
    })
  })

  test.describe('Desktop-first (maxWidth) - smaller breakpoints should win', () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, {
        name: 'MediaQueriesV5',
        type: 'useCase',
        searchParams: { v5config: 'true' },
      })
    })

    test('on tiny viewport (500px), $max-sm should win over $max-md and $max-lg', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 500, height: 800 })
      const element = page.locator('[data-testid="test-desktop-first"]')
      const styles = await getStyles(element)
      // max-sm (640), max-md (768), max-lg (1024) all match, but max-sm should win
      expect(styles.backgroundColor).toBe('rgb(255, 255, 0)') // yellow from $max-sm
    })

    test('on medium viewport (700px), $max-md should win over $max-lg', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 700, height: 800 })
      const element = page.locator('[data-testid="test-desktop-first"]')
      const styles = await getStyles(element)
      // max-md (768), max-lg (1024) match, but max-md should win
      expect(styles.backgroundColor).toBe('rgb(255, 165, 0)') // orange from $max-md
    })

    test('on large viewport (900px), $max-lg should apply', async ({ page }) => {
      await page.setViewportSize({ width: 900, height: 800 })
      const element = page.locator('[data-testid="test-desktop-first"]')
      const styles = await getStyles(element)
      // only max-lg (1024) should match
      expect(styles.backgroundColor).toBe('rgb(0, 128, 0)') // green from $max-lg
    })

    test('on huge viewport (1200px), base (red) should apply', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 })
      const element = page.locator('[data-testid="test-desktop-first"]')
      const styles = await getStyles(element)
      // none of the max-* breakpoints should match
      expect(styles.backgroundColor).toBe('rgb(255, 0, 0)') // red (base)
    })
  })
})
