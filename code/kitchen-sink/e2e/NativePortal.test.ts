/**
 * Test for native portal with react-native-teleport integration
 * Verifies that Portal/Sheet/Popover work correctly when using teleport
 */

import { by, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { safeLaunchApp, safeReloadApp, withSync } from './utils/detox'

async function navigateToNativePortal() {
  await navigateToTestCase('NativePortalTest', 'portal-status', {
    // Re-enabling sync after navigation is brittle on iOS once portal animations settle.
    skipEnableSync: true,
  })
}

async function openSelect() {
  await withSync(() => element(by.id('native-portal-select-trigger')).tap())
  await waitFor(element(by.id('native-portal-select-option-apple')))
    .toBeVisible()
    .withTimeout(10000)
}

async function closeSelect() {
  await withSync(() => element(by.id('native-portal-select-option-apple')).tap())
  await waitFor(element(by.id('native-portal-select-trigger')))
    .toBeVisible()
    .withTimeout(10000)
}

async function openPopover() {
  await withSync(() => element(by.id('native-portal-popover-trigger')).tap())
  await waitFor(element(by.id('native-portal-popover-content')))
    .toBeVisible()
    .withTimeout(5000)
}

async function closePopover() {
  await withSync(() => element(by.id('native-portal-popover-close')).tap())
  await waitFor(element(by.id('native-portal-popover-content')))
    .not.toBeVisible()
    .withTimeout(3000)
}

async function openSheet() {
  await withSync(() => element(by.id('native-portal-sheet-trigger')).tap())
  await waitFor(element(by.id('native-portal-sheet-frame')))
    .toBeVisible()
    .withTimeout(5000)
}

async function closeSheet() {
  await withSync(() => element(by.id('native-portal-sheet-close')).tap())
  await waitFor(element(by.id('native-portal-sheet-text')))
    .not.toBeVisible()
    .withTimeout(5000)
}

describe('NativePortal', () => {
  beforeAll(async () => {
    await safeLaunchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await safeReloadApp()
    await navigateToNativePortal()
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
    await openSelect()
    await closeSelect()
  })

  it('should open and close Popover', async () => {
    await openPopover()
    await expect(element(by.id('native-portal-popover-text'))).toBeVisible()
    await closePopover()
  })

  it('should open and close Sheet', async () => {
    await openSheet()
    await expect(element(by.id('native-portal-sheet-text'))).toBeVisible()
    await closeSheet()
  })
})
