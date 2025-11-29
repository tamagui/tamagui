/**
 * Test for issue #1859: Select not working when mounted, unmounted, and mounted again
 * https://github.com/tamagui/tamagui/issues/1859
 *
 * Using Detox for more reliable cross-platform native testing.
 *
 * Note: This app uses Reanimated (via Moti) for animations, which can cause Detox
 * synchronization issues. We disable synchronization and use manual waits instead.
 */

import { by, device, element, expect, waitFor } from 'detox'

describe('SelectRemount', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
    // Disable Detox synchronization because Reanimated keeps the JS thread busy
    await device.disableSynchronization()
  })

  afterAll(async () => {
    await device.enableSynchronization()
  })

  beforeEach(async () => {
    // Reload the app to start fresh on home screen
    await device.reloadReactNative()
    // Wait for app to initialize after reload (since sync is disabled)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // Navigate to SelectRemount test case from home screen
    await navigateToSelectRemount()
  })

  it('should navigate to SelectRemount test case', async () => {
    // Verify we're on the right screen by checking for the remount button
    await expect(element(by.id('remount-button'))).toBeVisible()
  })

  it('should open Select on first mount', async () => {
    // Tap the select trigger
    await element(by.id('select-remount-test-trigger')).tap()

    // Wait for Select sheet to animate in
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Wait for Select options to appear (use toExist since it may be partially visible in sheet)
    await waitFor(element(by.id('select-remount-test-option-apple')))
      .toExist()
      .withTimeout(5000)

    // Close Select by pressing back on Android or tapping outside on iOS
    if (device.getPlatform() === 'android') {
      await device.pressBack()
    } else {
      await device.tap({ x: 200, y: 100 })
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  })

  it('should open Select after unmount/remount cycle', async () => {
    // Tap remount button to unmount and remount the Select
    await element(by.id('remount-button')).tap()

    // Wait a moment for remount to complete
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Try to open the Select again - THIS IS THE KEY TEST for #1859
    await element(by.id('select-remount-test-trigger')).tap()

    // Wait for Select sheet to animate in
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // If the bug exists, the Select won't open. With the fix, options should exist
    await waitFor(element(by.id('select-remount-test-option-apple')))
      .toExist()
      .withTimeout(5000)

    // Close Select
    if (device.getPlatform() === 'android') {
      await device.pressBack()
    } else {
      await device.tap({ x: 200, y: 100 })
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  })

  it('should work with multiple Selects after remount', async () => {
    // Verify we're on the SelectRemount screen
    await expect(element(by.id('remount-button'))).toBeVisible()

    // Tap remount to reset state
    await element(by.id('remount-button')).tap()

    // Wait for remount - give extra time on Android
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Verify remount button is still visible (we're still on the right screen)
    await waitFor(element(by.id('remount-button')))
      .toBeVisible()
      .withTimeout(5000)

    // Test first Select - wait for it to be ready after remount
    await waitFor(element(by.id('select-remount-test-trigger')))
      .toBeVisible()
      .withTimeout(5000)
    await element(by.id('select-remount-test-trigger')).tap()

    // Wait for Select sheet/content to animate in
    await waitFor(element(by.id('select-remount-test-option-apple')))
      .toBeVisible()
      .withTimeout(10000)

    // Select an option to close the Select instead of pressing back
    await element(by.id('select-remount-test-option-apple')).tap()

    // Wait for sheet to close
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verify we're still on the SelectRemount screen
    await waitFor(element(by.id('remount-button')))
      .toBeVisible()
      .withTimeout(5000)

    // Test second Select - wait for it to be visible
    await waitFor(element(by.id('select-remount-test-2-trigger')))
      .toBeVisible()
      .withTimeout(5000)
    await element(by.id('select-remount-test-2-trigger')).tap()
    await waitFor(element(by.id('select-remount-test-2-option-apple')))
      .toBeVisible()
      .withTimeout(10000)
  })
})

async function navigateToSelectRemount() {
  // Wait for app to load - look for "Kitchen Sink" title which is clearly visible
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(60000) // Longer timeout for Android bundle loading

  // Give the app a moment to fully render and settle
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Tap "Test Cases" using testID (works cross-platform)
  await waitFor(element(by.id('home-test-cases-link')))
    .toBeVisible()
    .withTimeout(10000)
  await element(by.id('home-test-cases-link')).tap()

  // Wait for Test Cases screen to load - wait for unique element "All Test Cases" header
  await waitFor(element(by.text('All Test Cases')))
    .toExist()
    .withTimeout(10000)

  // Small delay for the list to render
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // SelectRemount is in the middle of the alphabetically sorted list (position ~37)
  // Scroll until the element becomes visible (larger scroll for faster navigation)
  await waitFor(element(by.id('test-case-SelectRemount')))
    .toBeVisible()
    .whileElement(by.id('test-cases-scroll-view'))
    .scroll(600, 'down', Number.NaN, Number.NaN)

  await element(by.id('test-case-SelectRemount')).tap()

  // Wait for the test screen to load
  await waitFor(element(by.id('remount-button')))
    .toExist()
    .withTimeout(10000)
}
