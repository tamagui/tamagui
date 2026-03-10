import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Tooltip enter animation interrupted by trigger switch', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'TooltipMultiTriggerCase',
      type: 'useCase',
    })
    await page.waitForLoadState('networkidle')
  })

  test('enter animation completes after quick trigger switch', async ({ page }) => {
    const content = page.locator('#tip-content')

    // hover trigger A to start opening
    await page.locator('#tip-trigger-a').hover()
    // wait just long enough for tooltip to mount but enter animation to still be in-flight
    await page.waitForTimeout(80)

    // quickly switch to trigger C (interrupts the enter animation mid-flight)
    const triggerC = page.locator('#tip-trigger-c')
    const cBox = await triggerC.boundingBox()
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + cBox!.height / 2, {
      steps: 2,
    })

    // wait for animations to settle
    await page.waitForTimeout(600)

    await expect(content).toBeVisible({ timeout: 2000 })

    // the tooltip should be fully opaque — not stuck at a mid-flight value
    const opacity = await content.evaluate((el) => {
      return parseFloat(getComputedStyle(el).opacity)
    })
    expect(
      opacity,
      'tooltip should be fully opaque after enter completes'
    ).toBeGreaterThan(0.9)
  })

  test('enter animation completes after rapid multi-trigger sweep', async ({ page }) => {
    const content = page.locator('#tip-content')

    // hover trigger A
    await page.locator('#tip-trigger-a').hover()
    await page.waitForTimeout(60)

    // rapidly sweep A → B → C
    const triggerB = page.locator('#tip-trigger-b')
    const triggerC = page.locator('#tip-trigger-c')
    const bBox = await triggerB.boundingBox()
    const cBox = await triggerC.boundingBox()

    await page.mouse.move(bBox!.x + bBox!.width / 2, bBox!.y + bBox!.height / 2, {
      steps: 2,
    })
    await page.waitForTimeout(30)
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + cBox!.height / 2, {
      steps: 2,
    })

    // wait for animations to settle
    await page.waitForTimeout(600)

    await expect(content).toBeVisible({ timeout: 2000 })

    const opacity = await content.evaluate((el) => {
      return parseFloat(getComputedStyle(el).opacity)
    })
    expect(opacity, 'tooltip should be fully opaque after rapid sweep').toBeGreaterThan(
      0.9
    )
  })
})
