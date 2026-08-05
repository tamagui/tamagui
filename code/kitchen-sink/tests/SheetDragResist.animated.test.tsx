/**
 * Playwright E2E tests for Sheet drag resistance behavior
 *
 * Ported from Detox tests to verify web implementation matches native quality.
 *
 * Tests three scenarios:
 * 1. Sheet without ScrollView - drag up should show resistance
 * 2. Sheet with ScrollView but NO scrollable content - drag should move sheet, not scroll
 * 3. Sheet with ScrollView and scrollable content - drag up at top should show resistance
 */

import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// mobile viewport with touch support for realistic sheet testing
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
})

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetDragResistCase', type: 'useCase' })
})

/**
 * perform a drag gesture using mouse events
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

/**
 * wait for the sheet frame to be fully settled (no transform movement) before
 * interacting with content inside it.
 *
 * clicking an element inside the sheet while the frame is still animating in -
 * or has only just stopped - makes chromium (mobile emulation) scroll the
 * tapped element to the top of the enclosing ScrollView. this is browser
 * behavior around taps on recently-transformed content, not sheet code: it
 * reproduces with zero drags, on a non-focusable paragraph click, with the
 * sheet's scroll lock never engaging, and tracks the enter animation rather
 * than any app state. a fixed post-open timeout leaves the click racing the
 * enter spring on slow machines, so wait for real box stability instead.
 */
async function waitForSheetSettled(page: Page, frameTestId: string) {
  await expect
    .poll(
      async () => {
        const read = () =>
          page.evaluate(
            (testId) =>
              document.querySelector(`[data-testid="${testId}"]`)?.getBoundingClientRect()
                .top ?? Number.NaN,
            frameTestId
          )
        const before = await read()
        await page.waitForTimeout(300)
        const after = await read()
        return Math.abs(after - before)
      },
      { timeout: 15_000 }
    )
    .toBeLessThan(0.5)
}

test.describe('Bug #3: Sheet without ScrollView - drag up resistance', () => {
  /**
   * When at top snap point, dragging up should apply resistance
   * (sheet moves slightly then springs back, showing visual rubber band effect)
   */
  test('should show resistance when dragging up on handle at top position', async ({
    page,
  }) => {
    await page.getByTestId('no-scroll-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('no-scroll-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify we're at position 0 (top snap point)
    await expect(page.getByTestId('no-scroll-snap-indicator')).toContainText(
      'Current snap point: 0'
    )

    // get handle position
    const handle = page.getByTestId('no-scroll-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // drag UP on handle - this should show resistance and spring back
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      -150,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // sheet should still be at position 0 (didn't dismiss or change snap)
    await expect(page.getByTestId('no-scroll-snap-indicator')).toContainText(
      'Current snap point: 0'
    )
    // frame should still be visible (sheet didn't disappear)
    await expect(frame).toBeVisible()
  })

  test('should show resistance when dragging up on frame content', async ({ page }) => {
    await page.getByTestId('no-scroll-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('no-scroll-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify at position 0
    await expect(page.getByTestId('no-scroll-snap-indicator')).toContainText(
      'Current snap point: 0'
    )

    // reset tracking (settle first: clicking into a still-animating sheet
    // triggers a spurious chromium tap-scroll, see waitForSheetSettled)
    await waitForSheetSettled(page, 'no-scroll-frame')
    await page.getByTestId('no-scroll-reset').click()

    // get frame position for dragging on content
    const frameBox = await frame.boundingBox()
    expect(frameBox).toBeTruthy()

    // drag UP on frame content - should show resistance
    await dragSheet(
      page,
      frameBox!.x + frameBox!.width / 2,
      frameBox!.y + frameBox!.height / 2,
      -200,
      { steps: 30, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // sheet should snap back to position 0
    await expect(page.getByTestId('no-scroll-snap-indicator')).toContainText(
      'Current snap point: 0'
    )
    await expect(frame).toBeVisible()
  })

  test('should drag sheet down to lower snap point', async ({ page }) => {
    await page.getByTestId('no-scroll-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('no-scroll-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify at position 0
    await expect(page.getByTestId('no-scroll-snap-indicator')).toContainText(
      'Current snap point: 0'
    )

    // get handle position
    const handle = page.getByTestId('no-scroll-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // drag DOWN on handle - should move to snap point 1
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // sheet should have moved to position 1
    await expect(page.getByTestId('no-scroll-snap-indicator')).toContainText(
      'Current snap point: 1'
    )
  })
})

test.describe('Bug #1: Sheet with non-scrollable ScrollView', () => {
  /**
   * When ScrollView has content that fits (not scrollable), dragging
   * down should move the sheet to the next snap point.
   */
  test('should drag sheet DOWN when ScrollView content is not scrollable', async ({
    page,
  }) => {
    await page.getByTestId('non-scrollable-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('non-scrollable-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // reset counters (settle first, see waitForSheetSettled)
    await waitForSheetSettled(page, 'non-scrollable-frame')
    await page.getByTestId('non-scrollable-reset').click()

    // verify we start at position 0
    await expect(page.getByTestId('non-scrollable-snap-indicator')).toContainText(
      'Current snap point: 0'
    )

    // get scrollview position
    const scrollview = page.getByTestId('non-scrollable-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // drag DOWN on the scrollview content - should drag the sheet
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 3,
      200,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // EXPECTED: position changes to 1 (sheet moved down to lower snap)
    await expect(page.getByTestId('non-scrollable-snap-indicator')).toContainText(
      'Current snap point: 1'
    )

    // scroll should still be at 0 (no scroll happened)
    await expect(page.getByTestId('non-scrollable-scroll-y')).toContainText('Scroll Y: 0')
  })

  test('should let handle always be draggable regardless of ScrollView', async ({
    page,
  }) => {
    await page.getByTestId('non-scrollable-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('non-scrollable-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify we start at position 0
    await expect(page.getByTestId('non-scrollable-snap-indicator')).toContainText(
      'Current snap point: 0'
    )

    // get handle position
    const handle = page.getByTestId('non-scrollable-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // drag down on handle - this should ALWAYS work
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // handle drag should move the sheet
    await expect(page.getByTestId('non-scrollable-snap-indicator')).toContainText(
      'Current snap point: 1'
    )
  })
})

test.describe('Bug #2: Sheet with scrollable ScrollView - drag up resistance', () => {
  /**
   * At scroll top and sheet top, dragging up should apply resistance
   * (rubber band effect) rather than doing nothing.
   */
  test('should show resistance when dragging up at scroll top and sheet top', async ({
    page,
  }, testInfo) => {
    const driver = (testInfo.project?.metadata as any)?.animationDriver
    if (driver === 'motion') {
      // motion driver layout shifts cause spurious scroll events during handle drag
      test.skip()
    }

    await page.getByTestId('scrollable-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('scrollable-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // reset tracking (settle first, see waitForSheetSettled)
    await waitForSheetSettled(page, 'scrollable-frame')
    await page.getByTestId('scrollable-reset').click()

    // ensure we're at scroll top and position 0
    await expect(page.getByTestId('scrollable-at-top')).toContainText(
      'At scroll top: YES'
    )

    // get handle position
    const handle = page.getByTestId('scrollable-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // drag UP on handle - at scroll top + sheet top, should show resistance
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      -150,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // after rubber band, should still be at scroll top (no scroll happened)
    await expect(page.getByTestId('scrollable-at-top')).toContainText(
      'At scroll top: YES'
    )

    // frame should still be visible (sheet didn't disappear)
    await expect(frame).toBeVisible()
  })

  test('should scroll content when swiping up inside scrollable sheet', async ({
    page,
  }) => {
    await page.getByTestId('scrollable-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('scrollable-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify starting state - at scroll top
    await expect(page.getByTestId('scrollable-at-top')).toContainText(
      'At scroll top: YES'
    )

    // get scrollview
    const scrollview = page.getByTestId('scrollable-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // use wheel to scroll content (more reliable than drag for scroll)
    await page.mouse.move(
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 2
    )
    await page.mouse.wheel(0, 200)
    await page.waitForTimeout(400)

    // scroll Y should now be > 0
    await expect(page.getByTestId('scrollable-at-top')).toContainText('At scroll top: NO')
  })

  test('should drag sheet DOWN via handle when at scroll top', async ({ page }) => {
    await page.getByTestId('scrollable-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('scrollable-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify at scroll top
    await expect(page.getByTestId('scrollable-at-top')).toContainText(
      'At scroll top: YES'
    )

    // get handle position
    const handle = page.getByTestId('scrollable-handle')
    const handleBox = await handle.boundingBox()
    expect(handleBox).toBeTruthy()

    // drag DOWN on handle - should move sheet to position 1
    await dragSheet(
      page,
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2,
      200,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // sheet should be at lower snap point (position 1)
    await expect(page.getByTestId('scrollable-snap-indicator')).toContainText(
      'Position: 1'
    )
  })

  test('should drag sheet DOWN via scrollview area when at scroll top', async ({
    page,
  }) => {
    await page.getByTestId('scrollable-trigger').click()
    await page.waitForTimeout(600)

    const frame = page.getByTestId('scrollable-frame')
    await expect(frame).toBeVisible({ timeout: 5000 })

    // verify at scroll top
    await expect(page.getByTestId('scrollable-at-top')).toContainText(
      'At scroll top: YES'
    )

    // get scrollview position
    const scrollview = page.getByTestId('scrollable-scrollview')
    const scrollviewBox = await scrollview.boundingBox()
    expect(scrollviewBox).toBeTruthy()

    // drag DOWN on scrollview - should move sheet (not scroll, since at scroll top)
    await dragSheet(
      page,
      scrollviewBox!.x + scrollviewBox!.width / 2,
      scrollviewBox!.y + scrollviewBox!.height / 3,
      200,
      { steps: 25, stepDelay: 16 }
    )
    await page.waitForTimeout(600)

    // sheet should be at lower snap point (position 1)
    await expect(page.getByTestId('scrollable-snap-indicator')).toContainText(
      'Position: 1'
    )
  })
})
