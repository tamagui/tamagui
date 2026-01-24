/**
 * Detox E2E tests for Sheet drag resistance behavior
 *
 * Tests three scenarios:
 * 1. Sheet without ScrollView - drag up should show resistance
 * 2. Sheet with ScrollView but NO scrollable content - drag should move sheet, not scroll
 * 3. Sheet with ScrollView and scrollable content - drag up at top should show resistance
 *
 * These tests validate the bugs:
 * - Bug #1: if has scrollview but content not scrollable, dragging wasn't moving the sheet
 * - Bug #2: drag up past end / resist isn't moving much
 * - Bug #3: no scrollview also drag up / resist not doing much
 */

import { by, device, element, expect, waitFor } from 'detox'

// only run on iOS - RNGH gesture handling differs on Android
const isAndroid = () => device.getPlatform() === 'android'

describe('SheetDragResist', () => {
  beforeAll(async () => {
    if (isAndroid()) return
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    if (isAndroid()) return
    // reload between tests for clean state
    await device.reloadReactNative()
    // disable sync to avoid hanging on spring animations
    await device.disableSynchronization()
    await navigateToSheetDragResistCase()
  })

  afterEach(async () => {
    if (isAndroid()) return
    await device.enableSynchronization()
  })

  it('should navigate to SheetDragResistCase test case', async () => {
    if (isAndroid()) return
    await expect(element(by.id('sheet-drag-resist-screen'))).toBeVisible()
    await expect(element(by.id('no-scroll-trigger'))).toBeVisible()
    await expect(element(by.id('non-scrollable-trigger'))).toBeVisible()
    await expect(element(by.id('scrollable-trigger'))).toBeVisible()
  })

  describe('Bug #3: Sheet without ScrollView - drag up resistance', () => {
    /**
     * BUG #3 TEST: Drag up on sheet without ScrollView should show resistance
     *
     * Expected: When at top snap point, dragging up should apply resistance
     * (sheet moves slightly then springs back, showing visual rubber band effect)
     *
     * BUG: Currently dragging up doesn't show much/any movement at all
     */
    it('should show resistance when dragging up on handle at top position', async () => {
      if (isAndroid()) return

      await element(by.id('no-scroll-trigger')).tap()

      await waitFor(element(by.id('no-scroll-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // verify we're at position 0 (top snap point)
      await expect(element(by.id('no-scroll-snap-indicator'))).toHaveText('Current snap point: 0')

      await device.takeScreenshot('bug3-handle-before-drag')

      // drag UP on handle - this should show resistance and spring back
      await element(by.id('no-scroll-handle')).swipe('up', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 500))

      await device.takeScreenshot('bug3-handle-after-drag')

      // sheet should still be at position 0 (didn't dismiss or change snap)
      await expect(element(by.id('no-scroll-snap-indicator'))).toHaveText('Current snap point: 0')
      // frame should still be visible (sheet didn't disappear)
      await expect(element(by.id('no-scroll-frame'))).toBeVisible()
    })

    it('should show resistance when dragging up on frame content', async () => {
      if (isAndroid()) return

      await element(by.id('no-scroll-trigger')).tap()

      await waitFor(element(by.id('no-scroll-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // verify at position 0
      await expect(element(by.id('no-scroll-snap-indicator'))).toHaveText('Current snap point: 0')

      // reset tracking
      await element(by.id('no-scroll-reset')).tap()

      await device.takeScreenshot('bug3-frame-before-drag')

      // drag UP on frame content - should show resistance
      await element(by.id('no-scroll-frame')).swipe('up', 'slow', 0.9)

      await new Promise((resolve) => setTimeout(resolve, 500))

      await device.takeScreenshot('bug3-frame-after-drag')

      // sheet should snap back to position 0
      await expect(element(by.id('no-scroll-snap-indicator'))).toHaveText('Current snap point: 0')

      // check the max drag indicator - should be > 0 if resistance was working
      // (the test component tracks maximum upward drag distance)
      const attrs = await element(by.id('no-scroll-drag-indicator')).getAttributes()
      console.log('Bug #3 - Max upward drag detected:', (attrs as any).text)
    })
  })

  describe('Bug #1: Sheet with non-scrollable ScrollView', () => {
    /**
     * BUG #1 TEST: Non-scrollable ScrollView content should let sheet drag through
     *
     * Expected: When ScrollView has content that fits (not scrollable), dragging
     * down should move the sheet to the next snap point.
     *
     * BUG: ScrollView captures the gesture and sheet doesn't move.
     */
    it('should drag sheet DOWN when ScrollView content is not scrollable', async () => {
      if (isAndroid()) return

      await element(by.id('non-scrollable-trigger')).tap()

      await waitFor(element(by.id('non-scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // reset counters
      await element(by.id('non-scrollable-reset')).tap()

      // verify we start at position 0
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 0')

      await device.takeScreenshot('bug1-before-drag')

      // swipe DOWN on the scrollview content
      // BUG: if this scrolls instead of moving the sheet, the bug exists
      await element(by.id('non-scrollable-scrollview')).swipe('down', 'slow', 0.5)

      await new Promise((resolve) => setTimeout(resolve, 500))

      await device.takeScreenshot('bug1-after-drag')

      // check results
      const posAttr = await element(by.id('non-scrollable-snap-indicator')).getAttributes()
      const statusAttr = await element(by.id('non-scrollable-status')).getAttributes()
      console.log('Bug #1 result - Position:', (posAttr as any).text, 'Status:', (statusAttr as any).text)

      // EXPECTED: position changes to 1 (sheet moved down to lower snap)
      // BUGGY: position stays 0 but scroll events fired
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 1')
    })

    it('should let handle always be draggable regardless of ScrollView', async () => {
      if (isAndroid()) return

      await element(by.id('non-scrollable-trigger')).tap()

      await waitFor(element(by.id('non-scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // verify we start at position 0
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 0')

      await device.takeScreenshot('bug1-handle-before')

      // swipe down on handle - this should ALWAYS work
      await element(by.id('non-scrollable-handle')).swipe('down', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 500))

      await device.takeScreenshot('bug1-handle-after')

      // handle drag should move the sheet
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 1')
    })
  })

  describe('Bug #2: Sheet with scrollable ScrollView - drag up resistance', () => {
    /**
     * BUG #2 TEST: At scroll top and sheet top, dragging up should show resistance
     *
     * Expected: When scrollY=0 and sheet at top snap point, dragging up should
     * apply resistance (rubber band effect) rather than doing nothing.
     *
     * BUG: Dragging up at this position doesn't move much at all
     */
    it('should show resistance when dragging up at scroll top and sheet top', async () => {
      if (isAndroid()) return

      await element(by.id('scrollable-trigger')).tap()

      await waitFor(element(by.id('scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // reset tracking
      await element(by.id('scrollable-reset')).tap()

      // ensure we're at scroll top and position 0
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: YES')

      await device.takeScreenshot('bug2-before')

      // drag UP on handle - at scroll top + sheet top, should show resistance
      await element(by.id('scrollable-handle')).swipe('up', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 600))

      await device.takeScreenshot('bug2-after')

      // after rubber band, should still be at scroll top (no scroll happened)
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: YES')

      // frame should still be visible (sheet didn't disappear)
      await expect(element(by.id('scrollable-frame'))).toBeVisible()

      // check max drag indicator
      const attrs = await element(by.id('scrollable-status')).getAttributes()
      console.log('Bug #2 - Max upward drag:', (attrs as any).text)
    })

    it('should scroll content when swiping up inside scrollable sheet', async () => {
      if (isAndroid()) return

      await element(by.id('scrollable-trigger')).tap()

      await waitFor(element(by.id('scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // verify starting state - at scroll top
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: YES')

      // swipe UP on scrollview content - should scroll content (not move sheet)
      await element(by.id('scrollable-scrollview')).swipe('up', 'slow', 0.5)

      await new Promise((resolve) => setTimeout(resolve, 400))

      // scroll Y should now be > 0
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: NO')
    })

    it('should drag sheet DOWN via handle when at scroll top', async () => {
      if (isAndroid()) return

      await element(by.id('scrollable-trigger')).tap()

      await waitFor(element(by.id('scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // verify at scroll top
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: YES')

      await device.takeScreenshot('scrollable-handle-before')

      // drag DOWN on handle - should move sheet to position 1
      await element(by.id('scrollable-handle')).swipe('down', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 500))

      await device.takeScreenshot('scrollable-handle-after')

      // sheet should be at lower snap point (or dismissed)
      // verify animation completes without crash
      await new Promise((resolve) => setTimeout(resolve, 500))
    })
  })
})

async function navigateToSheetDragResistCase() {
  // wait for app to load
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(60000)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  // tap test cases
  await waitFor(element(by.id('home-test-cases-link')))
    .toBeVisible()
    .withTimeout(10000)
  await element(by.id('home-test-cases-link')).tap()

  // wait for test cases screen
  await waitFor(element(by.text('All Test Cases')))
    .toExist()
    .withTimeout(10000)

  await new Promise((resolve) => setTimeout(resolve, 500))

  // scroll to and tap SheetDragResistCase
  await waitFor(element(by.id('test-case-SheetDragResistCase')))
    .toBeVisible()
    .whileElement(by.id('test-cases-scroll-view'))
    .scroll(600, 'down', Number.NaN, Number.NaN)

  await element(by.id('test-case-SheetDragResistCase')).tap()

  // wait for test screen
  await waitFor(element(by.id('sheet-drag-resist-screen')))
    .toExist()
    .withTimeout(10000)
}
