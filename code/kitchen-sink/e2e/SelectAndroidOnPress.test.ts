/**
 * Detox E2E Test for issue #3436: Select onValueChange not firing on Android physical devices
 * https://github.com/tamagui/tamagui/issues/3436
 *
 * The bug: On physical Android devices, tapping a Select.Item does not trigger onValueChange.
 * Console logging shows onPressIn and onPressOut fire, but onPress never does.
 *
 * This test verifies that:
 * 1. The Select trigger can be tapped to open the sheet
 * 2. Tapping an item closes the sheet AND updates the selected value
 * 3. The change count increments (proving onValueChange was called)
 *
 * Note: This test is Android-specific - skip on iOS
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'

// helper to skip tests on iOS
const skipOnIOS = () => {
  if (device.getPlatform() === 'ios') {
    return true
  }
  return false
}

describe('SelectAndroidOnPress (#3436)', () => {
  beforeAll(async () => {
    if (skipOnIOS()) return
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    if (skipOnIOS()) return
    await device.reloadReactNative()
    await navigateToTestCase('SelectAndroidOnPress', 'select-android-trigger')
  })

  it('should render the test case screen', async () => {
    if (skipOnIOS()) return
    await expect(element(by.id('select-android-title'))).toBeVisible()
    await expect(element(by.id('select-android-trigger'))).toBeVisible()
  })

  it('should open the Select sheet when trigger is tapped', async () => {
    if (skipOnIOS()) return
    // tap the select trigger
    await element(by.id('select-android-trigger')).tap()

    // wait for sheet to open and items to be visible
    await waitFor(element(by.id('select-android-item-apple')))
      .toBeVisible()
      .withTimeout(5000)

    // verify other items are also visible
    await expect(element(by.id('select-android-item-pear'))).toBeVisible()
  })

  it('should update value when item is tapped - THIS IS THE BUG TEST', async () => {
    if (skipOnIOS()) return
    // verify initial state: no value selected, change count is 0
    await expect(element(by.id('select-android-selected-value'))).toHaveText(
      'Selected value: (none)'
    )
    await expect(element(by.id('select-android-change-count'))).toHaveText('Change count: 0')

    // open the select
    await element(by.id('select-android-trigger')).tap()

    // wait for items to appear
    await waitFor(element(by.id('select-android-item-apple')))
      .toBeVisible()
      .withTimeout(5000)

    // tap an item - THIS IS WHERE THE BUG MANIFESTS
    // on physical Android devices, this tap fires onPressIn/onPressOut but NOT onPress
    await element(by.id('select-android-item-pear')).tap()

    // wait for the sheet to close
    await waitFor(element(by.id('select-android-item-apple')))
      .not.toBeVisible()
      .withTimeout(5000)

    // THE KEY ASSERTIONS - these fail on physical Android due to the bug:
    // the value should have been updated
    await expect(element(by.id('select-android-selected-value'))).toHaveText(
      'Selected value: pear'
    )
    // the change count should have incremented (proving onValueChange was called)
    await expect(element(by.id('select-android-change-count'))).toHaveText('Change count: 1')
  })

  it('should handle tap with slight movement (simulates physical device jitter)', async () => {
    if (skipOnIOS()) return
    // This test simulates the physical device behavior where slight finger
    // movement during a tap can cause the responder to be stolen by the Sheet's ScrollView
    //
    // On physical devices, fingers are never perfectly still during a tap.
    // This small movement can trigger onMoveShouldSetResponder on the parent ScrollView,
    // which steals the responder and prevents onPress from firing on the child.
    await expect(element(by.id('select-android-change-count'))).toHaveText('Change count: 0')

    // open the select
    await element(by.id('select-android-trigger')).tap()

    await waitFor(element(by.id('select-android-item-peach')))
      .toBeVisible()
      .withTimeout(5000)

    // simulate a "jiggly" tap by using longPressAndDrag with small vertical movement
    // this mimics what physical devices do when fingers aren't perfectly still
    // the small vertical movement (0.01 = ~1% of element height) should NOT prevent selection
    // but before the fix, it would cause the ScrollView to steal responder
    await element(by.id('select-android-item-peach')).longPressAndDrag(
      150, // duration in ms
      0.5, // start at center X
      0.5, // start at center Y
      element(by.id('select-android-item-peach')), // stay on same element
      0.5, // end at same X
      0.55, // end slightly lower (5% vertical movement, simulating finger jitter)
      'slow', // slow speed to simulate real finger
      50 // short hold
    )

    // wait for potential sheet close (give it time)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // verify selection worked despite the slight movement
    // if the fix works, peach should be selected
    // if the fix doesn't work, the responder was stolen and nothing was selected
    await expect(element(by.id('select-android-selected-value'))).toHaveText(
      'Selected value: peach'
    )
    await expect(element(by.id('select-android-change-count'))).toHaveText('Change count: 1')
  })

  it('should allow multiple selections', async () => {
    if (skipOnIOS()) return
    // first selection
    await element(by.id('select-android-trigger')).tap()
    await waitFor(element(by.id('select-android-item-apple')))
      .toBeVisible()
      .withTimeout(5000)
    await element(by.id('select-android-item-apple')).tap()
    await waitFor(element(by.id('select-android-item-apple')))
      .not.toBeVisible()
      .withTimeout(5000)

    await expect(element(by.id('select-android-selected-value'))).toHaveText(
      'Selected value: apple'
    )
    await expect(element(by.id('select-android-change-count'))).toHaveText('Change count: 1')

    // second selection - change to blackberry
    await element(by.id('select-android-trigger')).tap()
    await waitFor(element(by.id('select-android-item-blackberry')))
      .toBeVisible()
      .withTimeout(5000)
    await element(by.id('select-android-item-blackberry')).tap()
    await waitFor(element(by.id('select-android-item-blackberry')))
      .not.toBeVisible()
      .withTimeout(5000)

    await expect(element(by.id('select-android-selected-value'))).toHaveText(
      'Selected value: blackberry'
    )
    await expect(element(by.id('select-android-change-count'))).toHaveText('Change count: 2')
  })
})

