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

test.describe('Select rtl positioning', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectRtlCase', type: 'useCase' })
  })

  // the list is 8px wider than the trigger and centered on it, in both
  // directions and whether the items mounted before the first open or not
  for (const dir of ['ltr', 'rtl'] as const) {
    for (const id of ['rtl-select', 'rtl-lazy']) {
      test(`${id} list covers the trigger under ${dir}`, async ({ page }) => {
        if (dir === 'rtl') {
          await page.getByTestId('rtl-toggle').click()
          await expect(page.getByTestId('rtl-status')).toHaveText('rtl')
        }
        const trigger = page.getByTestId(`${id}-trigger`)
        const triggerBox = (await trigger.boundingBox())!
        await trigger.click()
        const viewport = page.getByTestId(`${id}-viewport`)
        await expect(viewport).toBeVisible()
        await expect(viewport.getByTestId('rtl-item-banana')).toBeFocused()

        const viewportBox = (await viewport.boundingBox())!
        expect(viewportBox.x).toBeCloseTo(triggerBox.x - 4, 0)
        expect(viewportBox.x + viewportBox.width).toBeCloseTo(
          triggerBox.x + triggerBox.width + 4,
          0
        )
        expect(viewportBox.y).toBeLessThan(triggerBox.y + triggerBox.height)
        expect(viewportBox.y + viewportBox.height).toBeGreaterThan(triggerBox.y)
      })
    }
  }
})
