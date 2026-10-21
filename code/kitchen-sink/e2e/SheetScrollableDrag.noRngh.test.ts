/**
 * Sheet.ScrollView with the sheet's RNGH off (the responder fallback): scrolling the content must not leave the
 * sheet locked, so a later drag of the handle still moves it between snaps.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

const isAndroid = () => device.getPlatform() === 'android'

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
    // a visible handle can still be sliding in, and a drag that starts mid-open
    // releases from that in-flight position, so wait for the open to finish
    await waitFor(element(by.id('sheet-scrollable-drag-transition-end')))
      .toHaveText('Transition end: open finished')
      .withTimeout(3000)

    await withSync(() =>
      element(by.id('sheet-scrollable-drag-handle')).swipe('down', 'slow', 0.5)
    )
    await waitFor(element(by.id('sheet-scrollable-drag-position')))
      .toHaveText('Sheet position: 1')
      .withTimeout(3000)
  })
})
