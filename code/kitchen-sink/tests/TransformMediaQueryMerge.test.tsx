import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression tests for transform media query merging bug
 *
 * Bug: When a media query sets transform props like `x`, it should OVERWRITE
 * the base value, not be CUMULATIVE (added together).
 *
 * Example:
 * - Base: x={-100}
 * - $sm: { x: 50 }
 * - Expected at $sm: x = 50 (overwrite)
 * - Bug behavior: x = -50 (cumulative: -100 + 50)
 */

test.describe('Transform Media Query Merge', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'TransformMediaQueryMerge', type: 'useCase' })
  })

  // Helper to extract translateX from transform
  async function getTranslateX(page: any, testId: string): Promise<number> {
    return page.evaluate((id: string) => {
      const el = document.querySelector(`[data-testid="${id}"]`)
      if (!el) return NaN
      const transform = getComputedStyle(el).transform
      if (transform === 'none') return 0

      // Handle matrix(a, b, c, d, tx, ty) format
      const matrixMatch = transform.match(/matrix\(([^)]+)\)/)
      if (matrixMatch) {
        const values = matrixMatch[1].split(',').map((v: string) => parseFloat(v.trim()))
        return values[4] || 0
      }
      return 0
    }, testId)
  }

  test('base transform values apply at large viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(300)

    // Test 1: styled() component with x=-100 base
    const x1 = await getTranslateX(page, 'test1')
    expect(x1, 'styled component base x=-100').toBeCloseTo(-100, 0)

    // Test 3: runtime prop with x=-75 base
    const x3 = await getTranslateX(page, 'test3')
    expect(x3, 'runtime prop base x=-75').toBeCloseTo(-75, 0)
  })

  test('media query x OVERWRITES base value (not cumulative)', async ({ page }) => {
    // Set viewport to $sm breakpoint
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(300)

    // Test 1: styled() with base x=-100, $sm: x=50
    // If cumulative (bug): x = -100 + 50 = -50
    // If overwrite (correct): x = 50
    const x1 = await getTranslateX(page, 'test1')
    expect(x1, 'styled $sm x should OVERWRITE to 50, not cumulate to -50').toBeCloseTo(50, 0)
  })

  test('runtime prop media query x OVERWRITES base value', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(300)

    // Test 3: runtime prop with base x=-75, $sm: x=75
    // If cumulative (bug): x = -75 + 75 = 0
    // If overwrite (correct): x = 75
    const x3 = await getTranslateX(page, 'test3')
    expect(x3, 'runtime $sm x should OVERWRITE to 75, not cumulate to 0').toBeCloseTo(75, 0)
  })

  test('viewport resize updates transform correctly', async ({ page }) => {
    // Start large - should have base value
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(300)

    let x1 = await getTranslateX(page, 'test1')
    expect(x1, 'large viewport: x=-100').toBeCloseTo(-100, 0)

    // Resize to small - should overwrite to media query value
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(300)

    x1 = await getTranslateX(page, 'test1')
    expect(x1, 'small viewport: x should be 50 (overwrite)').toBeCloseTo(50, 0)

    // Resize back to large - should return to base value
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(300)

    x1 = await getTranslateX(page, 'test1')
    expect(x1, 'back to large: x=-100').toBeCloseTo(-100, 0)
  })
})
