import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests for onLayout with CSS scale transform.
 *
 * The issue: When a CSS scale transform is applied, getBoundingClientRect()
 * returns the transformed (scaled) dimensions, but the expected behavior
 * (matching React Native) is to return the pre-transform dimensions.
 *
 * See: https://github.com/tamagui/tamagui/pull/2329
 */

test.describe('onLayout with CSS scale', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'OnLayoutScale',
      type: 'useCase',
      waitExtra: true, // Wait for layout callbacks
    })
  })

  test('box without scale reports correct dimensions', async ({ page }) => {
    // Wait for layout to be reported
    await page.waitForTimeout(500)

    const layoutText = await page.getByTestId('layout-no-scale').textContent()

    // Box is 200x200 with no scale - should report 200x200
    expect(layoutText).toContain('200')
    expect(layoutText).toMatch(/200.*200/)
  })

  test('box with scale(0.5) reports pre-transform dimensions (200x200, not 100x100)', async ({
    page,
  }) => {
    // Wait for layout to be reported
    await page.waitForTimeout(500)

    const layoutText = await page.getByTestId('layout-with-scale').textContent()

    // Box is 200x200 with scale(0.5).
    // EXPECTED: Should report 200x200 (pre-transform size, matching React Native)
    // BUG: Currently reports 100x100 (post-transform size from getBoundingClientRect)

    // This test should FAIL until the fix is implemented
    expect(
      layoutText,
      'onLayout should report pre-transform dimensions (200x200), not transformed dimensions (100x100)'
    ).toContain('200')
    expect(layoutText).toMatch(/200.*200/)
  })

  test('both boxes report the same dimensions despite different scales', async ({ page }) => {
    // Wait for layout to be reported
    await page.waitForTimeout(500)

    const noScaleText = await page.getByTestId('layout-no-scale').textContent()
    const withScaleText = await page.getByTestId('layout-with-scale').textContent()

    // Extract width and height from the text (format: "No Scale: 200x200")
    const noScaleMatch = noScaleText?.match(/(\d+)x(\d+)/)
    const withScaleMatch = withScaleText?.match(/(\d+)x(\d+)/)

    expect(noScaleMatch).toBeTruthy()
    expect(withScaleMatch).toBeTruthy()

    if (noScaleMatch && withScaleMatch) {
      const noScaleWidth = parseInt(noScaleMatch[1])
      const noScaleHeight = parseInt(noScaleMatch[2])
      const withScaleWidth = parseInt(withScaleMatch[1])
      const withScaleHeight = parseInt(withScaleMatch[2])

      // Both should report the same pre-transform dimensions
      expect(
        withScaleWidth,
        `Scaled box width (${withScaleWidth}) should equal unscaled (${noScaleWidth})`
      ).toBe(noScaleWidth)
      expect(
        withScaleHeight,
        `Scaled box height (${withScaleHeight}) should equal unscaled (${noScaleHeight})`
      ).toBe(noScaleHeight)
    }
  })

  test('relayout also reports pre-transform dimensions', async ({ page }) => {
    // Wait for initial layout
    await page.waitForTimeout(500)

    // Trigger a relayout
    await page.getByTestId('trigger-relayout').click()
    await page.waitForTimeout(500)

    const layoutText = await page.getByTestId('layout-with-scale').textContent()

    // After relayout, should still report pre-transform dimensions
    expect(
      layoutText,
      'After relayout, onLayout should still report pre-transform dimensions'
    ).toContain('200')
  })
})
