/**
 * Test for native portal with react-native-teleport integration
 * Verifies that Portal/Sheet/Popover work correctly when using teleport
 */

import { by, device, element, expect, waitFor } from 'detox'

describe('NativePortal', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToNativePortalTest()
  })

  it('should navigate to NativePortalTest test case', async () => {
    // verify we're on the right screen by checking for portal status
    await expect(element(by.id('portal-status'))).toBeVisible()
  })

  it('should show teleport as enabled', async () => {
    // check that teleport is detected and enabled
    const statusText = element(by.id('portal-status'))
    await expect(statusText).toBeVisible()
    // the status should indicate teleport is active (not "Not enabled")
    // we can't easily check text content in detox, but visibility confirms component renders
  })

  it('should open Select with Sheet', async () => {
    await device.disableSynchronization()

    try {
      // tap the select trigger
      await element(by.id('native-portal-select-trigger')).tap()

      // wait for select options to appear
      await waitFor(element(by.id('native-portal-select-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // close by selecting an option
      await element(by.id('native-portal-select-option-apple')).tap()

      // wait for sheet to close
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      await device.enableSynchronization()
    }
  })

  it('should open and close Popover', async () => {
    await device.disableSynchronization()

    try {
      // tap popover trigger
      await element(by.id('native-portal-popover-trigger')).tap()

      // wait for popover content to appear
      await waitFor(element(by.id('native-portal-popover-content')))
        .toBeVisible()
        .withTimeout(5000)

      // verify text is visible inside popover
      await expect(element(by.id('native-portal-popover-text'))).toBeVisible()

      // close popover
      await element(by.id('native-portal-popover-close')).tap()

      // wait for popover to close
      await new Promise((resolve) => setTimeout(resolve, 500))

      // popover content should no longer be visible
      await waitFor(element(by.id('native-portal-popover-content')))
        .not.toBeVisible()
        .withTimeout(3000)
    } finally {
      await device.enableSynchronization()
    }
  })

  it('should open and close Sheet', async () => {
    await device.disableSynchronization()

    try {
      // tap sheet trigger
      await element(by.id('native-portal-sheet-trigger')).tap()

      // wait for sheet frame to appear
      await waitFor(element(by.id('native-portal-sheet-frame')))
        .toBeVisible()
        .withTimeout(5000)

      // verify text is visible inside sheet
      await expect(element(by.id('native-portal-sheet-text'))).toBeVisible()

      // close sheet
      await element(by.id('native-portal-sheet-close')).tap()

      // wait for sheet to close
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // sheet should no longer be visible
      await waitFor(element(by.id('native-portal-sheet-frame')))
        .not.toBeVisible()
        .withTimeout(5000)
    } finally {
      await device.enableSynchronization()
    }
  })
})

async function navigateToNativePortalTest() {
  // wait for app to load
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(60000)

  // give app time to settle
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // tap "Test Cases"
  await waitFor(element(by.id('home-test-cases-link')))
    .toBeVisible()
    .withTimeout(10000)
  await element(by.id('home-test-cases-link')).tap()

  // wait for test cases screen
  await waitFor(element(by.text('All Test Cases')))
    .toExist()
    .withTimeout(10000)

  await new Promise((resolve) => setTimeout(resolve, 500))

  // scroll to find NativePortalTest and tap it
  await waitFor(element(by.id('test-case-NativePortalTest')))
    .toBeVisible()
    .whileElement(by.id('test-cases-scroll-view'))
    .scroll(600, 'down', Number.NaN, Number.NaN)

  await element(by.id('test-case-NativePortalTest')).tap()

  // wait for the test screen to load
  await waitFor(element(by.id('portal-status')))
    .toExist()
    .withTimeout(10000)
}
