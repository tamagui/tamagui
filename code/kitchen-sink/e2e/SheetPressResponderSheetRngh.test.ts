/**
 * Regression for setupGestureHandler({ pressEvents: false, sheet: true }).
 *
 * pressEvents: false must move Tamagui pressables onto the responder fallback
 * without dragging Sheet down to its PanResponder fallback. This mirrors the
 * workaround from #4024 while keeping Sheet on RNGH.
 */

import { by, element, expect, waitFor } from 'detox'
import { remountDirectUseCase } from './utils/navigation'
import { safeLaunchApp } from './utils/detox'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const testElement = (id: string) => element(by.id(id)).atIndex(0)

async function openSheet() {
  await testElement('sheet-press-trigger').tap()
  await waitFor(testElement('sheet-press-input')).toBeVisible().withTimeout(5000)
  await sleep(700)
}

describe('SheetPressResponderSheetRngh', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: {
        directUseCase: 'SheetPressRegressionCase',
        disablePressEventsKeepSheet: true,
      },
    })
    await waitFor(element(by.id('sheet-press-screen')))
      .toExist()
      .withTimeout(180000)
  })

  beforeEach(async () => {
    await remountDirectUseCase('sheet-press-screen')
  })

  it('disables press RNGH while keeping Sheet RNGH enabled', async () => {
    await expect(testElement('sheet-press-press-rngh-status')).toHaveText(
      'pressRNGH: off'
    )
    await expect(testElement('sheet-press-sheet-rngh-status')).toHaveText('sheetRNGH: on')
  })

  it('fires responder-backed pressables inside an RNGH sheet', async () => {
    await openSheet()

    await testElement('sheet-press-scroll-button').tap()
    await sleep(200)
    await expect(testElement('sheet-press-scroll-button-count')).toHaveText(
      'scrollButton: 1'
    )

    await testElement('sheet-press-media-card').tap()
    await sleep(200)
    await expect(testElement('sheet-press-media-card-count')).toHaveText('mediaCard: 1')

    await testElement('sheet-press-footer-post').tap()
    await sleep(200)
    await expect(testElement('sheet-press-post-count')).toHaveText('post: 1')
  })

  it('keeps sheet drag working with press RNGH disabled', async () => {
    await openSheet()

    await testElement('sheet-press-frame').swipe('down', 'slow', 0.75)
    await sleep(700)

    await waitFor(testElement('sheet-press-input')).not.toBeVisible().withTimeout(5000)
  })
})
