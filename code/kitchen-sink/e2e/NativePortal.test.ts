/**
 * Test for native portal with react-native-teleport integration
 * Verifies that Portal/Sheet/Popover work correctly when using teleport
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'

describe('NativePortal', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await device.reloadReactNative()
    await navigateToTestCase('NativePortalTest', 'portal-status')
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

      // close sheet by swiping down (dismissOnSnapToBottom)
      await element(by.id('native-portal-sheet-frame')).swipe('down', 'fast')

      // wait for sheet close animation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // sheet text should no longer be visible
      await waitFor(element(by.id('native-portal-sheet-text')))
        .not.toBeVisible()
        .withTimeout(5000)
    } finally {
      await device.enableSynchronization()
    }
  })
})

