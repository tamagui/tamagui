/**
 * regression: after 2ce98f604a (tap maxDistance + responder termination),
 * real-handler pressables inside a snapPointsMode="fit" modal Sheet stopped
 * firing onPress on Android - both inside the Sheet.ScrollView and in a footer
 * rendered inside the Frame but outside the ScrollView.
 *
 * mirrors the 3pc create-thread sheet. A clean tap on any button must fire
 * exactly one onPress.
 */

import { by, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { safeLaunchApp, safeReloadApp } from './utils/detox'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const testElement = (id: string) => element(by.id(id)).atIndex(0)

async function openSheet() {
  await testElement('sheet-press-trigger').tap()
  // native can expose duplicated Fabric nodes for the same testID; atIndex(0)
  // keeps the wait/action target deterministic.
  await waitFor(testElement('sheet-press-input')).toBeVisible().withTimeout(5000)
  await sleep(700)
}

describe('SheetPressRegression', () => {
  beforeAll(async () => {
    await safeLaunchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await safeReloadApp()
    await navigateToTestCase('SheetPressRegressionCase', 'sheet-press-screen')
  })

  it('footer Post / Cancel buttons fire onPress', async () => {
    await openSheet()

    await testElement('sheet-press-footer-post').tap()
    await sleep(200)
    await expect(testElement('sheet-press-post-count')).toHaveText('post: 1')

    await testElement('sheet-press-footer-cancel').tap()
    await sleep(200)
    await expect(testElement('sheet-press-cancel-count')).toHaveText('cancel: 1')

    await testElement('sheet-press-footer-post').tap()
    await sleep(200)
    await expect(testElement('sheet-press-post-count')).toHaveText('post: 2')
  })

  it('scrollview button + poll-style View + media card fire onPress', async () => {
    await openSheet()

    await testElement('sheet-press-scroll-button').tap()
    await sleep(200)
    await expect(testElement('sheet-press-scroll-button-count')).toHaveText(
      'scrollButton: 1'
    )

    await testElement('sheet-press-nested-view').tap()
    await sleep(200)
    await expect(testElement('sheet-press-nested-view-count')).toHaveText('nestedView: 1')

    await testElement('sheet-press-media-card').tap()
    await sleep(200)
    await expect(testElement('sheet-press-media-card-count')).toHaveText('mediaCard: 1')
  })

  it('media card press survives keyboard-driven sheet movement', async () => {
    await openSheet()

    await testElement('sheet-press-input').tap()
    await sleep(500)

    await testElement('sheet-press-media-card').tap()
    await sleep(300)
    await expect(testElement('sheet-press-media-card-count')).toHaveText('mediaCard: 1')
  })

  it('sheet can be dragged closed', async () => {
    await openSheet()

    await testElement('sheet-press-frame').swipe('down', 'slow', 0.75)
    await sleep(700)

    await waitFor(testElement('sheet-press-input')).not.toBeVisible().withTimeout(5000)
  })
})
