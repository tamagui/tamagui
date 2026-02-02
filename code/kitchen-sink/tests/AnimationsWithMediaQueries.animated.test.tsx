import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests for animated properties responding to media query changes.
 *
 * This tests the useStyleEmitter path which allows style updates without re-renders.
 * When media queries change, the animation driver receives new styles and must
 * update the DOM accordingly.
 *
 * Note: The 'native' driver (animations-react-native) doesn't support avoidReRenders/useStyleEmitter,
 * so these tests are skipped for that driver.
 */

async function getScale(page: Page, testId: string): Promise<number> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return -1
    const transform = getComputedStyle(el).transform
    if (transform === 'none') return 1
    // matrix(a, b, c, d, tx, ty) - scaleX is in the 'a' position
    const match = transform.match(/matrix\(([^,]+),/)
    return match ? Number.parseFloat(match[1]) : 1
  }, testId)
}

async function getTranslateX(page: Page, testId: string): Promise<number> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return NaN
    const transform = getComputedStyle(el).transform
    if (transform === 'none') return 0
    // matrix(a, b, c, d, tx, ty)
    const matrixMatch = transform.match(/matrix\(([^)]+)\)/)
    if (matrixMatch) {
      const values = matrixMatch[1].split(',').map((v: string) => parseFloat(v.trim()))
      return values[4] || 0
    }
    return 0
  }, testId)
}

test.describe('Animations With Media Queries', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Skip native driver - it doesn't support useStyleEmitter (avoidReRenders)
    test.skip(
      testInfo.project.name === 'animated-native',
      'Native driver does not support avoidReRenders/useStyleEmitter'
    )
    await setupPage(page, { name: 'AnimationsWithMediaQueriesCase', type: 'useCase' })
  })

  test('scale applies at large viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(500)

    const scale = await getScale(page, 'test-scale')
    expect(scale, 'scale should be 1 at large viewport').toBeCloseTo(1, 1)
  })

  test('scale applies at small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(500)

    const scale = await getScale(page, 'test-scale')
    expect(scale, 'scale should be 0.75 at $sm').toBeCloseTo(0.75, 1)
  })

  test('scale updates when resizing from large to small', async ({ page }) => {
    // start large
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(500)

    let scale = await getScale(page, 'test-scale')
    expect(scale, 'large viewport: scale=1').toBeCloseTo(1, 1)

    // resize to small
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(500)

    scale = await getScale(page, 'test-scale')
    expect(scale, 'small viewport: scale=0.75').toBeCloseTo(0.75, 1)
  })

  test('scale updates when resizing from small to large', async ({ page }) => {
    // start small
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(500)

    let scale = await getScale(page, 'test-scale')
    expect(scale, 'small viewport: scale=0.75').toBeCloseTo(0.75, 1)

    // resize to large
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(500)

    scale = await getScale(page, 'test-scale')
    expect(scale, 'large viewport: scale=1').toBeCloseTo(1, 1)
  })

  test('scale updates on multiple resize cycles', async ({ page }) => {
    // this is the key bug reproduction - multiple resize cycles
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(300)

    // cycle 1: large -> small -> large
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(300)
    let scale = await getScale(page, 'test-scale')
    expect(scale, 'cycle 1 small: scale=0.75').toBeCloseTo(0.75, 1)

    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(300)
    scale = await getScale(page, 'test-scale')
    expect(scale, 'cycle 1 large: scale=1').toBeCloseTo(1, 1)

    // cycle 2
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(300)
    scale = await getScale(page, 'test-scale')
    expect(scale, 'cycle 2 small: scale=0.75').toBeCloseTo(0.75, 1)

    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(300)
    scale = await getScale(page, 'test-scale')
    expect(scale, 'cycle 2 large: scale=1').toBeCloseTo(1, 1)

    // cycle 3
    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(300)
    scale = await getScale(page, 'test-scale')
    expect(scale, 'cycle 3 small: scale=0.75').toBeCloseTo(0.75, 1)
  })

  test('translateX updates on resize', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(500)

    let x = await getTranslateX(page, 'test-translate')
    expect(x, 'large viewport: x=10').toBeCloseTo(10, 0)

    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(500)

    x = await getTranslateX(page, 'test-translate')
    expect(x, 'small viewport: x=50').toBeCloseTo(50, -1) // precision -1 allows ±5
  })

  test('combined scale + translate updates on resize', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 })
    await page.waitForTimeout(500)

    let scale = await getScale(page, 'test-combined')
    expect(scale, 'large viewport: scale=1').toBeCloseTo(1, 1)

    await page.setViewportSize({ width: 600, height: 800 })
    await page.waitForTimeout(500)

    scale = await getScale(page, 'test-combined')
    expect(scale, 'small viewport: scale=0.75').toBeCloseTo(0.75, 1)
  })
})
