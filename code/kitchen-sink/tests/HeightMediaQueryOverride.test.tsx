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

  test('base scale=1 should apply when height < 640 (below $height-sm)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 500 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-height-scale')
    expect(scale, 'scale should be 1 at base (below $height-sm)').toBeCloseTo(1, 1)
  })

  test('$sm width query works for comparison', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 700 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-width-scale')
    expect(scale, 'scale should be 1.5 at $sm').toBeCloseTo(1.5, 1)
  })

  test('styled component with scale=1 in definition + $height-sm override', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 700 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-styled-scale')
    // styled component has scale=1 in definition, $height-sm should override to 2
    expect(scale, 'styled component scale should be 2 at $height-sm').toBeCloseTo(2, 1)
  })

  test('styled component with $height-sm in definition + runtime $height-sm override', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 700 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-styled-media-override')
    // styled has $height-sm: scale=0.5 in definition
    // runtime $height-sm: scale=2 should override
    expect(
      scale,
      'runtime $height-sm should override styled definition $height-sm'
    ).toBeCloseTo(2, 1)
  })

  test('ContainerLarge with WIDTH queries in definition + runtime $height-sm scale', async ({
    page,
  }) => {
    // exact scenario from chat app: ContainerLarge has $md/$lg width queries
    // used with scale=1 and $height-sm={{ scale: 2 }}
    await page.setViewportSize({ width: 1200, height: 700 })
    await page.waitForTimeout(300)

    const scale = await getScale(page, 'test-container-large')
    // should be 2 from $height-sm, not 1 from base
    expect(
      scale,
      'ContainerLarge with width queries should still allow $height-sm to override scale'
    ).toBeCloseTo(2, 1)
  })
})
