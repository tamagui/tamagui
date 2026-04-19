/**
 * Regression: pressStyle gets stuck on a pressable inside a horizontal
 * ScrollView when the user presses, drags sideways into a scroll, and lifts.
 *
 * Reported against the gesture-handler press path. pressIn fires, scroll takes
 * over, pressOut eventually fires, but the pressStyle backdrop stays applied
 * on the view — the animated bg color never returns to its rest value.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'

const PILLS = [
  'General',
  'Bellator',
  'Boxing',
  'Techniques',
  'Fighters',
  'Feedback',
  'News',
  'MMA',
  'Wrestling',
  'Muay Thai',
]

describe('PressStyleScrollStuck', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('PressStyleScrollStuck', 'press-scroll-stuck-root')
  })

  it('renders the pill strip', async () => {
    for (const name of PILLS.slice(0, 3)) {
      await expect(element(by.id(`pill-${name}`))).toBeVisible()
    }
  })

  it('fires one pressIn/pressOut pair per tap', async () => {
    await element(by.id('pill-Bellator')).tap()
    await new Promise((r) => setTimeout(r, 150))
    await expect(element(by.id('pill-count-Bellator'))).toHaveText('Bellator: 1')
  })

  // regression: pressStyle gets stuck when RNGH scroll takes ownership mid-press.
  // the gestureState fix fires an orphan onPressOut in onFinalize when didPressIn
  // is true but ownership has been lost — so pressOut count should equal pressIn
  // count even when the drag was stolen by the ScrollView.
  it('fires pressOut when scroll takes ownership mid-press', async () => {
    const scroll = element(by.id('pill-scroll'))

    await expect(element(by.id('pill-count-Bellator'))).toHaveText('Bellator: 0')
    await expect(element(by.id('pill-out-count-Bellator'))).toHaveText('Bellator out: 0')

    // press on Bellator (hold long enough for the 24ms grace-period pressIn to
    // schedule), then drag sideways so the ScrollView's PanGestureHandler steals
    // ownership. 'fast' + no tail hold reduces the synthetic touch frames that
    // can drift RN Fabric's _activeTouches registry out of sync with UIKit.
    await element(by.id('pill-Bellator')).longPressAndDrag(
      300,
      0.5,
      0.5,
      scroll,
      0.1,
      0.5,
      'fast',
      0
    )
    await new Promise((r) => setTimeout(r, 500))

    await expect(element(by.id('pill-count-Bellator'))).toHaveText('Bellator: 1')
    // the regression signal: without the orphan-pressOut fix this stays at 0
    await expect(element(by.id('pill-out-count-Bellator'))).toHaveText('Bellator out: 1')
  })
})
