/**
 * Test for issue #1859: Select not working when mounted, unmounted, and mounted again
 * https://github.com/tamagui/tamagui/issues/1859
 *
 * Using Detox for more reliable cross-platform native testing.
 *
 * IMPORTANT: Detox sync must be enabled for tap/gesture actions on RN 0.83 Fabric.
 * With sync disabled, Detox doesn't properly deliver touch events through the
 * responder system. We keep sync disabled for sheet animations (spring animations
 * block sync) but enable it briefly around each tap interaction.
 */

import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { safeLaunchApp, safeReloadApp, withSync } from './utils/detox'

/** close any open select sheet by tapping an option */
async function closeSelect() {
  if (device.getPlatform() === 'android') {
    await device.pressBack()
  } else {
    // tap an option to dismiss the sheet instead of device.tap({ x, y })
    // device.tap() uses XCUITest runner (spawns xcodebuild) which leaves
    // orphaned DTServiceHub processes that crash subsequent xcodebuild calls
    await withSync(() => element(by.id('select-remount-test-option-apple')).tap())
  }
  // wait for sheet close animation to finish (trigger becomes visible again)
  await waitFor(element(by.id('remount-button')))
    .toBeVisible()
    .withTimeout(5000)
}

/** tap remount button and wait for fresh component state */
async function remountAndWait() {
  await withSync(() => element(by.id('remount-button')).tap())
  await waitFor(element(by.id('select-remount-test-trigger')))
    .toBeVisible()
    .withTimeout(8000)
}

describe('SelectRemount', () => {
  beforeAll(async () => {
    await safeLaunchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await safeReloadApp()
    // skipEnableSync: tests manage sync themselves via withSync helper
    // re-enabling sync after navigation can hang if animations are still settling
    await navigateToTestCase('SelectRemount', 'remount-button', { skipEnableSync: true })
  })

  it('should navigate to SelectRemount test case', async () => {
    await waitFor(element(by.id('remount-button')))
      .toBeVisible()
      .withTimeout(5000)
  })

  it('should open Select on first mount', async () => {
    // sync already disabled from beforeEach (skipEnableSync)
    try {
      await withSync(() => element(by.id('select-remount-test-trigger')).tap())

      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      await closeSelect()
    } finally {
      await device.enableSynchronization()
    }
  })

  it('should open Select after unmount/remount cycle', async () => {
    await device.disableSynchronization()

    try {
      await remountAndWait()

      // try to open the Select again - THIS IS THE KEY TEST for #1859
      await withSync(() => element(by.id('select-remount-test-trigger')).tap())

      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      await closeSelect()
    } finally {
      await device.enableSynchronization()
    }
  })

  it('should work with multiple Selects after remount', async () => {
    await device.disableSynchronization()

    try {
      await remountAndWait()

      // test first Select
      await withSync(() => element(by.id('select-remount-test-trigger')).tap())

      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // select an option to close the sheet
      await withSync(() => element(by.id('select-remount-test-option-apple')).tap())

      // wait for first sheet to fully close before interacting with second select
      await waitFor(element(by.id('select-remount-test-2-trigger')))
        .toBeVisible()
        .withTimeout(15000)

      // test second Select
      await withSync(() => element(by.id('select-remount-test-2-trigger')).tap())
      await waitFor(element(by.id('select-remount-test-2-option-apple')))
        .toBeVisible()
        .withTimeout(10000)
    } finally {
      await device.enableSynchronization()
    }
  })
})
