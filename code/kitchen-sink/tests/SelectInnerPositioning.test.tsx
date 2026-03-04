import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Select Inner Positioning', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('selected item aligns with trigger vertically', async ({ page }) => {
    // first select banana, then reopen to check alignment
    const trigger = page.getByTestId('default-select-trigger')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    await trigger.click()
    await page.waitForTimeout(400)

    const viewport = page.getByTestId('default-select-viewport')
    await expect(viewport).toBeVisible()

    // banana is pre-selected (index 1), find its position
    const banana = page.getByTestId('default-select-banana')
    const bananaBox = await banana.boundingBox()
    expect(bananaBox).toBeTruthy()

    // the selected item (banana) should vertically overlap the trigger
    const triggerCenter = triggerBox!.y + triggerBox!.height / 2
    const bananaCenter = bananaBox!.y + bananaBox!.height / 2

    // allow some tolerance for borders/padding
    expect(Math.abs(triggerCenter - bananaCenter)).toBeLessThan(triggerBox!.height)
  })

  test('dropdown has constrained max-height', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    await trigger.click()
    await page.waitForTimeout(400)

    const viewport = page.getByTestId('basic-select-viewport')
    await expect(viewport).toBeVisible()
    const viewportBox = await viewport.boundingBox()
    expect(viewportBox).toBeTruthy()

    // viewport should not exceed the window height
    const windowHeight = await page.evaluate(() => window.innerHeight)
    expect(viewportBox!.height).toBeLessThanOrEqual(windowHeight)
  })

  test('dropdown overlaps trigger on re-open after selection', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')

    // open and select orange
    await trigger.click()
    await page.waitForTimeout(400)
    const viewport = page.getByTestId('basic-select-viewport')
    await expect(viewport).toBeVisible()

    const orange = page.getByTestId('select-orange')
    await orange.click()
    await page.waitForTimeout(300)
    await expect(viewport).not.toBeVisible()

    // re-open
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()
    await trigger.click()
    await page.waitForTimeout(400)
    await expect(viewport).toBeVisible()

    const viewportBox = await viewport.boundingBox()
    expect(viewportBox).toBeTruthy()

    // viewport should still overlap the trigger
    const triggerTop = triggerBox!.y
    const triggerBottom = triggerBox!.y + triggerBox!.height
    const viewportTop = viewportBox!.y
    const viewportBottom = viewportBox!.y + viewportBox!.height
    const verticalOverlap =
      Math.min(triggerBottom, viewportBottom) - Math.max(triggerTop, viewportTop)
    expect(verticalOverlap).toBeGreaterThan(0)
  })
})
