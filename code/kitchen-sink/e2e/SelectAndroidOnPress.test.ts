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
import { safeLaunchApp, safeReloadApp } from './utils/detox'
import { navigateToTestCase } from './utils/navigation'

const testElement = (id: string) => element(by.id(id)).atIndex(0)

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
    await safeLaunchApp({ newInstance: true })
  })

  beforeEach(async () => {
    if (skipOnIOS()) return
    await safeReloadApp()
    await navigateToTestCase('SelectAndroidOnPress', 'select-android-trigger')
  })

  it('should render the test case screen', async () => {
    if (skipOnIOS()) return
    await expect(testElement('select-android-title')).toBeVisible()
    await expect(testElement('select-android-trigger')).toBeVisible()
  })

  it('should open the Select sheet when trigger is tapped', async () => {
    if (skipOnIOS()) return
    // tap the select trigger
    await testElement('select-android-trigger').tap()

    // wait for sheet to open and items to be visible
    await waitFor(testElement('select-android-item-apple'))
      .toBeVisible()
      .withTimeout(5000)

    // verify other items are also visible
    await expect(testElement('select-android-item-pear')).toBeVisible()
  })

  it('should update value when item is tapped - THIS IS THE BUG TEST', async () => {
    if (skipOnIOS()) return
    // verify initial state: no value selected, change count is 0
    await expect(testElement('select-android-selected-value')).toHaveText(
      'Selected value: (none)'
    )
    await expect(testElement('select-android-change-count')).toHaveText('Change count: 0')

    // open the select
    await testElement('select-android-trigger').tap()

    // wait for items to appear
    await waitFor(testElement('select-android-item-apple'))
      .toBeVisible()
      .withTimeout(5000)

    // tap an item - THIS IS WHERE THE BUG MANIFESTS
    // on physical Android devices, this tap fires onPressIn/onPressOut but NOT onPress
    await testElement('select-android-item-pear').tap()

    // wait for the sheet to close
    await waitFor(testElement('select-android-item-apple'))
      .not.toBeVisible()
      .withTimeout(5000)

    // THE KEY ASSERTIONS - these fail on physical Android due to the bug:
    // the value should have been updated
    await expect(testElement('select-android-selected-value')).toHaveText(
      'Selected value: pear'
    )
    // the change count should have incremented (proving onValueChange was called)
    await expect(testElement('select-android-change-count')).toHaveText('Change count: 1')
  })

  it('should allow multiple selections', async () => {
    if (skipOnIOS()) return
    // first selection
    await testElement('select-android-trigger').tap()
    await waitFor(testElement('select-android-item-apple'))
      .toBeVisible()
      .withTimeout(5000)
    await testElement('select-android-item-apple').tap()
    await waitFor(testElement('select-android-item-apple'))
      .not.toBeVisible()
      .withTimeout(5000)

    await expect(testElement('select-android-selected-value')).toHaveText(
      'Selected value: apple'
    )
    await expect(testElement('select-android-change-count')).toHaveText('Change count: 1')

    // second selection - change to blackberry
    await testElement('select-android-trigger').tap()
    await waitFor(testElement('select-android-item-blackberry'))
      .toBeVisible()
      .withTimeout(5000)
    await testElement('select-android-item-blackberry').tap()
    await waitFor(testElement('select-android-item-blackberry'))
      .not.toBeVisible()
      .withTimeout(5000)

    await expect(testElement('select-android-selected-value')).toHaveText(
      'Selected value: blackberry'
    )
    await expect(testElement('select-android-change-count')).toHaveText('Change count: 2')
  })
})
