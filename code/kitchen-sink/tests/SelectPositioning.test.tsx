import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Select Positioning', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectFocusScopeCase', type: 'useCase' })
  })

  test('dropdown overlaps the trigger (inner positioning)', async ({ page }) => {
    const trigger = page.getByTestId('basic-select-trigger')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    await trigger.click()
    await page.waitForTimeout(400)

    const viewport = page.getByTestId('basic-select-viewport')
    await expect(viewport).toBeVisible()
    const viewportBox = await viewport.boundingBox()
    expect(viewportBox).toBeTruthy()

    // inner positioning: viewport should vertically overlap the trigger
    const triggerTop = triggerBox!.y
    const triggerBottom = triggerBox!.y + triggerBox!.height
    const viewportTop = viewportBox!.y
    const viewportBottom = viewportBox!.y + viewportBox!.height
    const verticalOverlap =
      Math.min(triggerBottom, viewportBottom) - Math.max(triggerTop, viewportTop)
    expect(verticalOverlap).toBeGreaterThan(0)
  })

  test('lazyMount dropdown overlaps the trigger (inner positioning)', async ({
    page,
  }) => {
    const trigger = page.getByTestId('lazy-select-trigger')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    await trigger.click()
    await page.waitForTimeout(600)

    const viewport = page.getByTestId('lazy-select-viewport')
    await expect(viewport).toBeVisible()
    const viewportBox = await viewport.boundingBox()
    expect(viewportBox).toBeTruthy()

    // inner positioning: viewport should vertically overlap the trigger
    const triggerTop = triggerBox!.y
    const triggerBottom = triggerBox!.y + triggerBox!.height
    const viewportTop = viewportBox!.y
    const viewportBottom = viewportBox!.y + viewportBox!.height
    const verticalOverlap =
      Math.min(triggerBottom, viewportBottom) - Math.max(triggerTop, viewportTop)
    expect(verticalOverlap).toBeGreaterThan(0)
  })
})
