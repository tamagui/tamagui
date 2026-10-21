/**
 * Sheet.ScrollView with the sheet's RNGH off (the responder fallback): scrolling the content must not leave the
 * sheet locked, so a later drag of the handle still moves it between snaps.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

const isAndroid = () => device.getPlatform() === 'android'

// waitFor re-reads the hierarchy back to back on the main thread, which drops
// the ui to a few frames a second and stretches the open spring past the wait;
// reading between pauses leaves the animation its frames
const awaitText = async (id: string, expected: string) => {
  const deadline = Date.now() + 3000
  for (;;) {
    const { text } = (await element(by.id(id)).getAttributes()) as { text?: string }
    if (text === expected) return
    if (Date.now() > deadline) throw new Error(`${id} stayed "${text}", expected "${expected}"`)
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
}

describe('SheetScrollableDrag - no RNGH', () => {
  beforeAll(async () => {
    if (isAndroid()) return
    await safeLaunchApp({
      newInstance: true,
      launchArgs: {
        directUseCase: 'SheetScrollableDrag',
        disableSheetGestureHandler: true,
      },
    })
    await waitFor(element(by.id('sheet-scrollable-drag-trigger')))
      .toExist()
      .withTimeout(180000)
  })

  it('drags the sheet down after scrolling its content', async () => {
    if (isAndroid()) return
    // sync stays off except around gestures, which reach the responder system only with sync on
    await remountDirectUseCase('sheet-scrollable-drag-trigger', { skipEnableSync: true })

    await element(by.id('sheet-scrollable-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-scrollable-drag-position')))
      .toHaveText('Sheet position: 0')
      .withTimeout(3000)

    await waitFor(element(by.id('sheet-scrollable-drag-scrollview')))
      .toBeVisible()
      .withTimeout(3000)
    await withSync(() =>
      element(by.id('sheet-scrollable-drag-scrollview')).swipe('up', 'slow', 0.5)
    )
    await waitFor(element(by.id('sheet-scrollable-drag-item-0')))
      .not.toBeVisible()
      .withTimeout(3000)
    await expect(element(by.id('sheet-scrollable-drag-position'))).toHaveText(
      'Sheet position: 0'
    )

    await withSync(() =>
      element(by.id('sheet-scrollable-drag-handle')).swipe('down', 'slow', 0.5)
    )
    await waitFor(element(by.id('sheet-scrollable-drag-position')))
      .toHaveText('Sheet position: 1')
      .withTimeout(3000)
  })

  it('drags the sheet down by its handle', async () => {
    if (isAndroid()) return
    // sync stays off except around gestures, which reach the responder system only with sync on
    await remountDirectUseCase('sheet-scrollable-drag-trigger', { skipEnableSync: true })

    await element(by.id('sheet-scrollable-drag-trigger')).tap()
    await waitFor(element(by.id('sheet-scrollable-drag-position')))
      .toHaveText('Sheet position: 0')
      .withTimeout(3000)
    await waitFor(element(by.id('sheet-scrollable-drag-handle')))
      .toBeVisible()
      .withTimeout(3000)
    // the open spring overshoots above its rest, so a drag aimed at the handle
    // before the open ends can land on the overlay and dismiss the sheet
    await awaitText('sheet-scrollable-drag-transition-end', 'Transition end: open finished')

    await withSync(() =>
      element(by.id('sheet-scrollable-drag-handle')).swipe('down', 'slow', 0.5)
    )
    await waitFor(element(by.id('sheet-scrollable-drag-position')))
      .toHaveText('Sheet position: 1')
      .withTimeout(3000)
  })
})
