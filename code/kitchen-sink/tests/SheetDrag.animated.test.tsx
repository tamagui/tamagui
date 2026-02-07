import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// mobile viewport with touch support for realistic sheet drag testing
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
})

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetDragCase', type: 'useCase' })
})

/**
 * perform a drag gesture using mouse events
 * PanResponder responds to mouse events on web
 */
async function dragSheet(
  page: Page,
  startX: number,
  startY: number,
  deltaY: number,
  options: { steps?: number; stepDelay?: number } = {}
) {
  const { steps = 20, stepDelay = 16 } = options

  await page.mouse.move(startX, startY)
  await page.mouse.down()

  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(startX, startY + (deltaY * i) / steps)
    await page.waitForTimeout(stepDelay)
  }

  await page.mouse.up()
}

test.describe('Sheet drag interactions', () => {
  test('dragging sheet changes snap point position state', async ({ page }) => {
    const trigger = page.getByTestId('drag-percent-trigger')
    const frame = page.getByTestId('drag-percent-frame')
    const handle = page.getByTestId('drag-percent-handle')
    const positionIndicator = page.getByTestId('drag-percent-snap-indicator')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    await expect(positionIndicator).toContainText('0')

    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    const startX = handleBox!.x + handleBox!.width / 2
    const startY = handleBox!.y + handleBox!.height / 2

    // drag down to cross threshold between 80% and 40%
    await dragSheet(page, startX, startY, 250)
    await page.waitForTimeout(600)

    // verify snap point state changed (this works)
    await expect(positionIndicator).toContainText('1')
  })

  test('dragging sheet down changes snap point (constant mode)', async ({ page }) => {
    const trigger = page.getByTestId('drag-constant-trigger')
    const frame = page.getByTestId('drag-constant-frame')
    const handle = page.getByTestId('drag-constant-handle')
    const positionIndicator = page.getByTestId('drag-constant-snap-indicator')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    await expect(positionIndicator).toContainText('0')

    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    const startX = handleBox!.x + handleBox!.width / 2
    const startY = handleBox!.y + handleBox!.height / 2

    // drag 200px to move from 500px to 250px snap point
    await dragSheet(page, startX, startY, 200)
    await page.waitForTimeout(600)

    // verify snap point state changed
    await expect(positionIndicator).toContainText('1')
  })

  test('dragging sheet past bottom dismisses it', async ({ page }) => {
    const trigger = page.getByTestId('dismiss-drag-trigger')
    const frame = page.getByTestId('dismiss-drag-frame')
    const handle = page.getByTestId('dismiss-drag-handle')
    const dismissCount = page.getByTestId('dismiss-drag-count')

    await expect(dismissCount).toContainText('0')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    const startX = handleBox!.x + handleBox!.width / 2
    const startY = handleBox!.y + handleBox!.height / 2

    // drag far down to dismiss (sheet is at 50%)
    await dragSheet(page, startX, startY, 500)
    await page.waitForTimeout(800)

    await expect(frame).not.toBeInViewport({ ratio: 0.5 })
    await expect(dismissCount).toContainText('1')
  })

  test('partial drag snaps back to original position', async ({ page }) => {
    const trigger = page.getByTestId('drag-percent-trigger')
    const frame = page.getByTestId('drag-percent-frame')
    const handle = page.getByTestId('drag-percent-handle')
    const positionIndicator = page.getByTestId('drag-percent-snap-indicator')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    await expect(positionIndicator).toContainText('0')

    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    const startX = handleBox!.x + handleBox!.width / 2
    const startY = handleBox!.y + handleBox!.height / 2

    // small drag that shouldn't cross threshold - use more steps for smoother movement
    await dragSheet(page, startX, startY, 20, { steps: 10 })
    await page.waitForTimeout(800)

    await expect(positionIndicator).toContainText('0')
  })

  // flaky: Playwright mouse events don't trigger PanResponder consistently for subsequent drags
  test.skip('dragging up from lower snap point returns to higher', async ({ page }) => {
    const trigger = page.getByTestId('drag-percent-trigger')
    const frame = page.getByTestId('drag-percent-frame')
    const handle = page.getByTestId('drag-percent-handle')
    const positionIndicator = page.getByTestId('drag-percent-snap-indicator')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    const startX = handleBox!.x + handleBox!.width / 2
    const startY = handleBox!.y + handleBox!.height / 2

    // first drag down to snap point 1
    await dragSheet(page, startX, startY, 250)
    await page.waitForTimeout(600)

    await expect(positionIndicator).toContainText('1')

    // wait for animation to fully settle
    await page.waitForTimeout(800)

    // get new handle position after snapping to lower position
    const newHandleBox = await handle.boundingBox()
    expect(newHandleBox).toBeTruthy()

    const newStartX = newHandleBox!.x + newHandleBox!.width / 2
    const newStartY = newHandleBox!.y + newHandleBox!.height / 2

    // drag UP (negative) to return to snap point 0
    await dragSheet(page, newStartX, newStartY, -200, { steps: 25, stepDelay: 16 })
    await page.waitForTimeout(600)

    // verify we returned to snap point 0
    await expect(positionIndicator).toContainText('0')
  })

  test('sheet frame moves during drag', async ({ page }) => {
    const trigger = page.getByTestId('drag-percent-trigger')
    const frame = page.getByTestId('drag-percent-frame')
    const handle = page.getByTestId('drag-percent-handle')

    await trigger.click()
    await expect(frame).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(400)

    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // get initial frame position
    const initialBox = await frame.boundingBox()
    expect(initialBox).toBeTruthy()
    const initialTop = initialBox!.y

    const startX = handleBox!.x + handleBox!.width / 2
    const startY = handleBox!.y + handleBox!.height / 2

    // start drag and hold mid-drag
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    // move in steps like a real drag
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(startX, startY + 10 * i)
      await page.waitForTimeout(16)
    }

    // check frame moved during drag
    const midDragBox = await frame.boundingBox()
    expect(midDragBox).toBeTruthy()

    await page.mouse.up()

    // frame should have moved down during drag
    // this verifies the drag gesture is actually being detected by the sheet
    expect(midDragBox!.y).toBeGreaterThan(initialTop)
  })
})
