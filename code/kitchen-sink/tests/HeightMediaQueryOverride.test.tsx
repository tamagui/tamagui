import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests for height media query overriding transform props (scale)
 * Uses v5 config where height-lg breakpoint: minHeight 1024px
 */

async function getScale(page: Page, testId: string): Promise<number> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return -1
    const transform = getComputedStyle(el).transform
    if (transform === 'none') return 1
    const match = transform.match(/matrix\(([^,]+),/)
    return match ? Number.parseFloat(match[1]) : 1
  }, testId)
}

async function getBgColor(page: Page, testId: string): Promise<string> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    return el ? getComputedStyle(el).backgroundColor : ''
  }, testId)
}

test.describe('Height Media Query Override', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'HeightMediaQueryOverrideCase',
      type: 'useCase',
      searchParams: { v5config: 'true' },
    })
  })

  test('$height-sm should override base scale=1 when height >= 640', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 700 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-height-scale')
    // should be 2 from $height-sm, not 1 from base
    expect(scale, 'scale should be 2 at $height-sm, not 1 from base').toBeCloseTo(2, 1)
  })

  test('$height-lg works when NO base scale is set', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 1100 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-height-scale-no-base')
    expect(scale, 'scale should be 2 at $height-lg').toBeCloseTo(2, 1)
  })

  test('base scale should apply when height < 1024', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-height-scale')
    expect(scale, 'scale should be 0.8 at base').toBeCloseTo(0.8, 1)
  })

  test('$sm width query works for comparison', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 700 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-width-scale')
    expect(scale, 'scale should be 1.5 at $sm').toBeCloseTo(1.5, 1)
  })
})
