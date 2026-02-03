/**
 * Detox E2E Test for Sheet + Keyboard interaction
 *
 * Tests smooth keyboard + sheet coordination:
 * 1. Open keyboard (tap input) -> sheet moves up smoothly
 * 2. Drag sheet down while keyboard open -> keyboard dismisses FIRST
 * 3. Dismiss keyboard (tap outside) -> sheet returns to original position
 * 4. Fast keyboard show/hide should be smooth
 *
 * When keyboard-controller is installed, these should be extra smooth (60/120 FPS).
 * Without it, falls back to basic Keyboard API (still functional, less smooth).
 *
 * TODO: This test is WIP - keyboard-controller causes Detox sync issues.
 * Need to investigate disableSynchronization() timing or alternative approach.
 */

import { by, device, element, expect, waitFor } from 'detox'

// only run on iOS - keyboard behavior differs on Android
const isAndroid = () => device.getPlatform() === 'android'

// skip until we fix keyboard-controller sync issues with Detox
describe.skip('SheetKeyboardDrag - Keyboard + Sheet Integration', () => {
  beforeAll(async () => {
    if (isAndroid()) return
    await device.launchApp({ newInstance: true })
    await navigateToSheetKeyboardDrag()
  })

  beforeEach(async () => {
    if (isAndroid()) return
    await device.reloadReactNative()
    await navigateToSheetKeyboardDrag()
  })

  it('should show status indicators', async () => {
    if (isAndroid()) return
    // RNGH should be enabled
    await expect(element(by.id('sheet-keyboard-drag-rngh-status'))).toHaveText('RNGH: ✓')
    // KBC status shows whether keyboard-controller is installed
    // either ✓ (enabled) or ○ (not installed, using fallback)
  })

  it('Case 1: open sheet and verify initial state', async () => {
    if (isAndroid()) return

    await element(by.id('sheet-keyboard-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-keyboard-drag-frame')))
      .toBeVisible()
      .withTimeout(3000)

    // wait for animation
    await new Promise((r) => setTimeout(r, 400))

    // should be at position 0, keyboard hidden
    await expect(element(by.id('sheet-keyboard-drag-position'))).toHaveText(
      'Sheet position: 0'
    )
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: hidden'
    )
  })

  it('Case 2: tap input shows keyboard, sheet moves up', async () => {
    if (isAndroid()) return

    // open sheet
    await element(by.id('sheet-keyboard-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-keyboard-drag-frame')))
      .toBeVisible()
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 400))

    await device.takeScreenshot('case2-before-keyboard')

    // tap input to show keyboard
    await element(by.id('sheet-keyboard-drag-input')).tap()
    await new Promise((r) => setTimeout(r, 500)) // wait for keyboard animation

    await device.takeScreenshot('case2-after-keyboard')

    // keyboard should be visible
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: visible'
    )

    // keyboard height should be > 0
    const kbHeightAttr = await element(
      by.id('sheet-keyboard-drag-kb-height')
    ).getAttributes()
    const kbHeightText = (kbHeightAttr as any).text as string
    const kbHeight = parseInt(kbHeightText.replace('Keyboard height: ', ''), 10)
    console.log('Case 2: keyboard height =', kbHeight)
    if (kbHeight < 200) {
      throw new Error(`Expected keyboard height > 200, got ${kbHeight}`)
    }
  })

  it('Case 3: dismiss keyboard returns sheet to original position', async () => {
    if (isAndroid()) return

    // open sheet
    await element(by.id('sheet-keyboard-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-keyboard-drag-frame')))
      .toBeVisible()
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 400))

    // tap input to show keyboard
    await element(by.id('sheet-keyboard-drag-input')).tap()
    await new Promise((r) => setTimeout(r, 500))
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: visible'
    )

    await device.takeScreenshot('case3-keyboard-visible')

    // dismiss keyboard via button
    await element(by.id('sheet-keyboard-drag-dismiss-kb')).tap()
    await new Promise((r) => setTimeout(r, 400))

    await device.takeScreenshot('case3-keyboard-dismissed')

    // keyboard should be hidden
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: hidden'
    )
    // sheet should still be at position 0 (restored)
    await expect(element(by.id('sheet-keyboard-drag-position'))).toHaveText(
      'Sheet position: 0'
    )
  })

  it('Case 4: drag sheet down while keyboard open dismisses keyboard first', async () => {
    if (isAndroid()) return

    // open sheet
    await element(by.id('sheet-keyboard-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-keyboard-drag-frame')))
      .toBeVisible()
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 400))

    // tap input to show keyboard
    await element(by.id('sheet-keyboard-drag-input')).tap()
    await new Promise((r) => setTimeout(r, 500))
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: visible'
    )

    await device.takeScreenshot('case4-before-drag')

    // drag sheet down on handle (should dismiss keyboard)
    await element(by.id('sheet-keyboard-drag-handle')).swipe('down', 'slow', 0.3)
    await new Promise((r) => setTimeout(r, 600))

    await device.takeScreenshot('case4-after-drag')

    // keyboard should be dismissed
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: hidden'
    )

    // check events - should see keyboard dismiss
    const eventsAttr = await element(by.id('sheet-keyboard-drag-events')).getAttributes()
    console.log('Case 4 events:', (eventsAttr as any).text)
  })

  it('Case 5: switch between inputs keeps keyboard visible', async () => {
    if (isAndroid()) return

    // open sheet
    await element(by.id('sheet-keyboard-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-keyboard-drag-frame')))
      .toBeVisible()
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 400))

    // tap first input
    await element(by.id('sheet-keyboard-drag-input')).tap()
    await new Promise((r) => setTimeout(r, 400))
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: visible'
    )

    // tap second input
    await element(by.id('sheet-keyboard-drag-input-2')).tap()
    await new Promise((r) => setTimeout(r, 300))

    // keyboard should still be visible
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: visible'
    )

    await device.takeScreenshot('case5-switched-inputs')
  })

  it('Case 6: close sheet dismisses keyboard', async () => {
    if (isAndroid()) return

    // open sheet
    await element(by.id('sheet-keyboard-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-keyboard-drag-frame')))
      .toBeVisible()
      .withTimeout(5000)
    await new Promise((r) => setTimeout(r, 600))

    // tap input to show keyboard
    await element(by.id('sheet-keyboard-drag-input')).tap()
    await new Promise((r) => setTimeout(r, 500))
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: visible'
    )

    // close sheet
    await element(by.id('sheet-keyboard-drag-close')).tap()
    await new Promise((r) => setTimeout(r, 500))

    // sheet should be closed
    await waitFor(element(by.id('sheet-keyboard-drag-frame')))
      .not.toBeVisible()
      .withTimeout(2000)

    // keyboard should be hidden (check outside sheet)
    await expect(element(by.id('sheet-keyboard-drag-kb-visible'))).toHaveText(
      'Keyboard: hidden'
    )
  })
})

async function navigateToSheetKeyboardDrag() {
  // wait for app to load
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(30000)

  await new Promise((r) => setTimeout(r, 500))

  // use quick access link from home screen
  await waitFor(element(by.id('home-sheet-keyboard-test')))
    .toBeVisible()
    .withTimeout(5000)
  await element(by.id('home-sheet-keyboard-test')).tap()

  // wait for test screen
  await waitFor(element(by.id('sheet-keyboard-drag-trigger')))
    .toExist()
    .withTimeout(5000)
}
