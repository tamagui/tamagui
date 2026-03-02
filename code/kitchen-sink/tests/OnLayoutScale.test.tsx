import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * tests for onLayout with CSS scale transform.
 *
 * default behavior (no flag):
 * - onLayout reports transformed dimensions (getBoundingClientRect behavior)
 * - a 200x200 element with scale(0.5) reports 100x100
 *
 * with __TAMAGUI_ONLAYOUT_PRETRANSFORM = true:
 * - onLayout should report pre-transform dimensions (matching RN behavior)
 * - a 200x200 element with scale(0.5) should report 200x200
 *
 * see: https://github.com/tamagui/tamagui/pull/2329
 */

test.describe('onLayout with CSS scale', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'OnLayoutScaleCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  test('unscaled box always reports correct dimensions (200x200)', async ({ page }) => {
    await page.waitForTimeout(500)

    const layoutText = await page.getByTestId('layout-no-scale').textContent()

    expect(layoutText).toContain('200')
    expect(layoutText).toMatch(/200.*200/)
  })

  test('scaled box reports transformed dimensions by default (100x100)', async ({
    page,
  }) => {
    // ensure flag is OFF
    await page.evaluate(() => {
      ;(globalThis as any).__TAMAGUI_ONLAYOUT_PRETRANSFORM = false
    })

    // trigger relayout to pick up the flag change
    await page.getByTestId('trigger-relayout').click()
    await page.waitForTimeout(500)

    const layoutText = await page.getByTestId('layout-with-scale').textContent()

    // without flag: 200x200 with scale(0.5) should report 100x100 (transformed)
    expect(layoutText).toContain('100')
    expect(layoutText).toMatch(/100.*100/)
  })

  test('scaled box reports pre-transform dimensions with flag enabled (200x200)', async ({
    page,
  }) => {
    // enable the flag
    await page.evaluate(() => {
      ;(globalThis as any).__TAMAGUI_ONLAYOUT_PRETRANSFORM = true
    })

    // trigger relayout to pick up the flag change
    await page.getByTestId('trigger-relayout').click()
    await page.waitForTimeout(500)

    const layoutText = await page.getByTestId('layout-with-scale').textContent()

    // with flag: 200x200 with scale(0.5) should report 200x200 (pre-transform, RN behavior)
    expect(layoutText).toContain('200')
    expect(layoutText).toMatch(/200.*200/)
  })

  test('both boxes report same dimensions with flag enabled', async ({ page }) => {
    // enable the flag
    await page.evaluate(() => {
      ;(globalThis as any).__TAMAGUI_ONLAYOUT_PRETRANSFORM = true
    })

    // trigger relayout
    await page.getByTestId('trigger-relayout').click()
    await page.waitForTimeout(500)

    const noScaleText = await page.getByTestId('layout-no-scale').textContent()
    const withScaleText = await page.getByTestId('layout-with-scale').textContent()

    // extract dimensions
    const noScaleMatch = noScaleText?.match(/(\d+)x(\d+)/)
    const withScaleMatch = withScaleText?.match(/(\d+)x(\d+)/)

    expect(noScaleMatch).toBeTruthy()
    expect(withScaleMatch).toBeTruthy()

    if (noScaleMatch && withScaleMatch) {
      // with flag enabled, both should report same pre-transform dimensions
      expect(withScaleMatch[1]).toBe(noScaleMatch[1])
      expect(withScaleMatch[2]).toBe(noScaleMatch[2])
    }
  })
})
