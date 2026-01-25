/**
 * Test for issue #1859: Select not working when mounted, unmounted, and mounted again
 * https://github.com/tamagui/tamagui/issues/1859
 *
 * Using Detox for more reliable cross-platform native testing.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('SelectRemount', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    // Reload the app to start fresh on home screen
    await device.reloadReactNative()
    // Navigate to SelectRemount test case from home screen
    await navigateToTestCase('SelectRemount', 'remount-button')
  })

  it('should navigate to SelectRemount test case', async () => {
    // Verify we're on the right screen by checking for the remount button
    await expect(element(by.id('remount-button'))).toBeVisible()
  })

  it('should open Select on first mount', async () => {
    // Disable synchronization during sheet animations - spring animations can be slow to settle
    await device.disableSynchronization()

    try {
      // Tap the select trigger
      await element(by.id('select-remount-test-trigger')).tap()

      // Wait for Select options to appear with timeout
      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // Close Select by pressing back on Android or tapping outside on iOS
      if (device.getPlatform() === 'android') {
        await device.pressBack()
      } else {
        await device.tap({ x: 200, y: 100 })
      }

      // Wait for sheet to close
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      // Re-enable synchronization
      await device.enableSynchronization()
    }
  })

  it('should open Select after unmount/remount cycle', async () => {
    // Disable synchronization during sheet animations - spring animations can be slow to settle
    await device.disableSynchronization()

    try {
      // Tap remount button to unmount and remount the Select
      await element(by.id('remount-button')).tap()

      // Wait a moment for remount to complete
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Try to open the Select again - THIS IS THE KEY TEST for #1859
      await element(by.id('select-remount-test-trigger')).tap()

      // If the bug exists, the Select won't open. With the fix, options should be visible
      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // Close Select
      if (device.getPlatform() === 'android') {
        await device.pressBack()
      } else {
        await device.tap({ x: 200, y: 100 })
      }

      // Wait for sheet to close
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      // Re-enable synchronization
      await device.enableSynchronization()
    }
  })

  it('should work with multiple Selects after remount', async () => {
    // Verify we're on the SelectRemount screen
    await expect(element(by.id('remount-button'))).toBeVisible()

    // Disable synchronization during sheet animations - spring animations can be slow to settle
    await device.disableSynchronization()

    try {
      // Tap remount to reset state
      await element(by.id('remount-button')).tap()

      // Wait for remount to complete and first Select to be ready
      await waitFor(element(by.id('select-remount-test-trigger')))
        .toBeVisible()
        .withTimeout(8000)

      // Small delay to ensure element is interactive after becoming visible
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Test first Select
      await element(by.id('select-remount-test-trigger')).tap()

      // Wait for Select sheet/content to animate in
      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // Select an option to close the Select instead of pressing back
      await element(by.id('select-remount-test-option-apple')).tap()

      // Wait for sheet to close - give spring animation time to settle
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Test second Select - wait for it to be visible after first sheet closes
      await waitFor(element(by.id('select-remount-test-2-trigger')))
        .toBeVisible()
        .withTimeout(8000)

      // Small delay to ensure element is interactive
      await new Promise((resolve) => setTimeout(resolve, 500))

      await element(by.id('select-remount-test-2-trigger')).tap()
      await waitFor(element(by.id('select-remount-test-2-option-apple')))
        .toBeVisible()
        .withTimeout(10000)
    } finally {
      // Re-enable synchronization
      await device.enableSynchronization()
    }
  })
})

