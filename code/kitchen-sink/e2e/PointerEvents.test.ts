/**
 * Native tests for pointer events
 * Verifies touch events map correctly to pointer events on native
 */

import { by, device, element, expect } from 'detox'
import { navigateToTestCase } from './utils/navigation'

async function navigateToPointerEvents() {
  await navigateToTestCase('PointerEventsCase', 'pointer-events-root')
}

describe('PointerEvents', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToPointerEvents()
  })

  it('should render the test case', async () => {
    await expect(element(by.id('pointer-target'))).toExist()
    await expect(element(by.id('down-count'))).toHaveText('Down: 0')
    await expect(element(by.id('up-count'))).toHaveText('Up: 0')
  })

  it('should fire pointerDown and pointerUp on tap', async () => {
    await element(by.id('pointer-target')).tap()

    await expect(element(by.id('down-count'))).toHaveText('Down: 1')
    await expect(element(by.id('up-count'))).toHaveText('Up: 1')
  })

  it('should fire pointerEnter on touch start', async () => {
    await element(by.id('pointer-target')).tap()

    await expect(element(by.id('enter-count'))).toHaveText('Enter: 1')
  })

  it('should fire pointerLeave on touch end', async () => {
    await element(by.id('pointer-target')).tap()

    await expect(element(by.id('leave-count'))).toHaveText('Leave: 1')
  })

  it('should fire pointerMove during drag', async () => {
    await element(by.id('pointer-target')).longPressAndDrag(
      300, // duration ms
      0.2, // start x (normalized)
      0.5, // start y (normalized)
      element(by.id('pointer-target')),
      0.8, // end x (normalized)
      0.5, // end y (normalized)
      'slow',
      0
    )

    // should have fired at least one move event (not still 0)
    const moveEl = element(by.id('move-count'))
    // if move fired, text won't be "Move: 0"
    await expect(moveEl).not.toHaveText('Move: 0')
  })

  // skipping this test because longPressAndDrag from one element to another has
  // visibility threshold issues in Detox when the root container extends beyond viewport
  it.skip('should fire pointerLeave when dragging off element', async () => {
    await element(by.id('pointer-target')).longPressAndDrag(
      500,
      0.5,
      0.5,
      element(by.id('pointer-events-root')),
      0.5,
      0.1, // drag to top of root (outside target)
      'slow',
      0
    )

    await new Promise((r) => setTimeout(r, 100))

    await expect(element(by.id('leave-count'))).toHaveText('Leave: 1')
  })

  it('should handle multiple tap cycles', async () => {
    await element(by.id('pointer-target')).tap()
    await element(by.id('pointer-target')).tap()
    await element(by.id('pointer-target')).tap()

    await expect(element(by.id('down-count'))).toHaveText('Down: 3')
    await expect(element(by.id('up-count'))).toHaveText('Up: 3')
    await expect(element(by.id('enter-count'))).toHaveText('Enter: 3')
    await expect(element(by.id('leave-count'))).toHaveText('Leave: 3')
  })

  // skipping this test because the capture-target (second 200px square) is often
  // partially off-screen and longPressAndDrag requires 100% visibility
  // the core pointer capture functionality is tested in web tests
  it.skip('should receive moves outside bounds when pointer is captured', async () => {
    // drag from capture target to outside (root area)
    // with setPointerCapture, moves should still fire even outside bounds
    await element(by.id('capture-target')).longPressAndDrag(
      500,
      0.5,
      0.5,
      element(by.id('pointer-events-root')),
      0.5,
      0.05, // drag way up outside the target
      'slow',
      0
    )

    // should have received move events even while outside bounds
    await expect(element(by.id('capture-move-count'))).not.toHaveText('CapMove: 0')
  })
})
