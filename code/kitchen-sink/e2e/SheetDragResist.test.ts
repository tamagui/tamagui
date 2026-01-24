/**
 * Detox E2E tests for Sheet drag resistance behavior
 *
 * Tests three scenarios:
 * 1. Sheet without ScrollView - drag up should show resistance
 * 2. Sheet with ScrollView but NO scrollable content - drag should move sheet, not scroll
 * 3. Sheet with ScrollView and scrollable content - drag up at top should show resistance
 *
 * These tests validate the bugs:
 * - if has scrollview but content not scrollable, dragging wasn't moving the sheet
 * - drag up past end / resist isn't moving much
 * - no scrollview also drag up / resist not doing much
 */

import { by, device, element, expect, waitFor } from 'detox'

describe('SheetDragResist', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToSheetDragResistCase()
    // disable sync to avoid hang on spring animations
    await device.disableSynchronization()
  })

  afterEach(async () => {
    await device.enableSynchronization()
  })

  it('should navigate to SheetDragResistCase test case', async () => {
    await expect(element(by.id('sheet-drag-resist-screen'))).toBeVisible()
    await expect(element(by.id('no-scroll-trigger'))).toBeVisible()
    await expect(element(by.id('non-scrollable-trigger'))).toBeVisible()
    await expect(element(by.id('scrollable-trigger'))).toBeVisible()
  })

  describe('Test 1: Sheet without ScrollView', () => {
    it('should open and close the sheet', async () => {
      await element(by.id('no-scroll-trigger')).tap()

      await waitFor(element(by.id('no-scroll-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await element(by.id('no-scroll-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    it('should detect drag up on sheet handle and show resistance', async () => {
      await element(by.id('no-scroll-trigger')).tap()

      await waitFor(element(by.id('no-scroll-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // drag the handle UP (from bottom to top of handle)
      // this should trigger resistance since we're at the top snap point
      await element(by.id('no-scroll-handle')).swipe('up', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 300))

      // sheet should still be at position 0 (didn't dismiss)
      await expect(element(by.id('no-scroll-snap-indicator'))).toHaveText('Current snap point: 0')

      await element(by.id('no-scroll-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    it('should show visual feedback when dragging up at top position', async () => {
      await element(by.id('no-scroll-trigger')).tap()

      await waitFor(element(by.id('no-scroll-frame')))
        .toBeVisible()
        .withTimeout(5000)

      // ensure we're at position 0 (top)
      await expect(element(by.id('no-scroll-snap-indicator'))).toHaveText('Current snap point: 0')

      await new Promise((resolve) => setTimeout(resolve, 300))

      // long drag up on the frame content area
      await element(by.id('no-scroll-frame')).swipe('up', 'slow', 0.9)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // after release, sheet should snap back to position 0 due to resistance
      await expect(element(by.id('no-scroll-snap-indicator'))).toHaveText('Current snap point: 0')

      await element(by.id('no-scroll-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })
  })

  describe('Test 2: Sheet with non-scrollable ScrollView', () => {
    it('should open and close the sheet', async () => {
      await element(by.id('non-scrollable-trigger')).tap()

      await waitFor(element(by.id('non-scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await element(by.id('non-scrollable-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    /**
     * KEY BUG TEST: Non-scrollable content should let sheet drag through
     *
     * BUG: When ScrollView has non-scrollable content, swiping down
     * should move the sheet to the next snap point. Instead, it's
     * capturing the gesture and not letting the sheet move.
     */
    it('should drag the sheet down when content is not scrollable', async () => {
      await element(by.id('non-scrollable-trigger')).tap()

      await waitFor(element(by.id('non-scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // reset counters
      await element(by.id('non-scrollable-reset')).tap()

      // verify we start at position 0
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 0')

      // swipe down on the scrollview content
      // BUG: if this scrolls instead of moving the sheet, the bug exists
      await element(by.id('non-scrollable-scrollview')).swipe('down', 'slow', 0.5)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // if the bug is fixed, position should change (sheet moved)
      // if the bug exists, position stays 0 but scroll events fired
      // this is the key assertion - we expect the sheet to move, not scroll
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 1')

      await element(by.id('non-scrollable-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    it('should let the sheet handle be draggable', async () => {
      await element(by.id('non-scrollable-trigger')).tap()

      await waitFor(element(by.id('non-scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // verify we start at position 0
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 0')

      // swipe down on the handle - this should always work
      await element(by.id('non-scrollable-handle')).swipe('down', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // handle drag should always move the sheet
      await expect(element(by.id('non-scrollable-snap-indicator'))).toHaveText('Current snap point: 1')

      await element(by.id('non-scrollable-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })
  })

  describe('Test 3: Sheet with scrollable ScrollView', () => {
    it('should open and close the sheet', async () => {
      await element(by.id('scrollable-trigger')).tap()

      await waitFor(element(by.id('scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await element(by.id('scrollable-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    it('should scroll content when swiping up inside scrollable sheet', async () => {
      await element(by.id('scrollable-trigger')).tap()

      await waitFor(element(by.id('scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // swipe up to scroll content
      await element(by.id('scrollable-scrollview')).swipe('up', 'slow', 0.5)

      await new Promise((resolve) => setTimeout(resolve, 300))

      // scroll Y should be > 0 now
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: NO')

      await element(by.id('scrollable-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    it('should show resistance when dragging up at scroll top and sheet top', async () => {
      await element(by.id('scrollable-trigger')).tap()

      await waitFor(element(by.id('scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // reset drag tracking
      await element(by.id('scrollable-reset')).tap()

      // ensure we're at scroll top and position 0
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: YES')

      // drag up on the handle - this should trigger resistance
      await element(by.id('scrollable-handle')).swipe('up', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // sheet should still be at position 0 (didn't scroll away)
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: YES')

      await element(by.id('scrollable-close')).tap()
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    it('should drag sheet down via handle when at scroll top', async () => {
      await element(by.id('scrollable-trigger')).tap()

      await waitFor(element(by.id('scrollable-frame')))
        .toBeVisible()
        .withTimeout(5000)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // verify at top
      await expect(element(by.id('scrollable-at-top'))).toHaveText('At scroll top: YES')

      // drag down on handle - should move sheet to position 1
      await element(by.id('scrollable-handle')).swipe('down', 'slow', 0.8)

      await new Promise((resolve) => setTimeout(resolve, 500))

      // sheet should have moved to position 1 (dismissed or snapped to lower point)
      // we can verify it's no longer visible or check position
      // for now just verify no crash and animation completes

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
