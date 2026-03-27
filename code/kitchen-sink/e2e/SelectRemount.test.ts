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

// enable sync briefly for an interaction, then disable again
async function withSync<T>(fn: () => Promise<T>): Promise<T> {
  await device.enableSynchronization()
  try {
    return await fn()
  } finally {
    await device.disableSynchronization()
  }
}

describe('SelectRemount', () => {
  beforeAll(async () => {
    await device.disableSynchronization()
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    // use launchApp instead of reloadReactNative to avoid transient Metro errors
    await device.disableSynchronization()
    await device.launchApp({ newInstance: true })
    // skipEnableSync: tests manage sync themselves via withSync helper
    // re-enabling sync after navigation can hang if animations are still settling
    await navigateToTestCase('SelectRemount', 'remount-button', { skipEnableSync: true })
  })

  it('should navigate to SelectRemount test case', async () => {
    // verify we're on the right screen by checking for the remount button
    await waitFor(element(by.id('remount-button')))
      .toBeVisible()
      .withTimeout(5000)
  })

  it('should open Select on first mount', async () => {
    // sync already disabled from beforeEach (skipEnableSync)
    try {
      // tap the select trigger (needs sync for touch delivery)
      await withSync(() => element(by.id('select-remount-test-trigger')).tap())

      // wait for select options to appear with timeout
      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // close Select by pressing back on Android or tapping outside on iOS
      if (device.getPlatform() === 'android') {
        await device.pressBack()
      } else {
        await withSync(() => device.tap({ x: 200, y: 100 }))
      }

      // wait for sheet to close
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      await device.enableSynchronization()
    }
  })

  it('should open Select after unmount/remount cycle', async () => {
    // disable sync during sheet animations
    await device.disableSynchronization()

    try {
      // tap remount button to unmount and remount the Select
      await withSync(() => element(by.id('remount-button')).tap())

      // wait for remount to complete
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // try to open the Select again - THIS IS THE KEY TEST for #1859
      await withSync(() => element(by.id('select-remount-test-trigger')).tap())

      // if the bug exists, the Select won't open. With the fix, options should be visible
      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // close Select
      if (device.getPlatform() === 'android') {
        await device.pressBack()
      } else {
        await withSync(() => device.tap({ x: 200, y: 100 }))
      }

      // wait for sheet to close
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      await device.enableSynchronization()
    }
  })

  it('should work with multiple Selects after remount', async () => {
    // verify we're on the SelectRemount screen
    await expect(element(by.id('remount-button'))).toBeVisible()

    // disable sync during sheet animations
    await device.disableSynchronization()

    try {
      // tap remount to reset state
      await withSync(() => element(by.id('remount-button')).tap())

      // wait for remount to complete and first Select to be ready
      await waitFor(element(by.id('select-remount-test-trigger')))
        .toBeVisible()
        .withTimeout(8000)

      // small delay to ensure element is interactive after becoming visible
      await new Promise((resolve) => setTimeout(resolve, 500))

      // test first Select (tap needs sync)
      await withSync(() => element(by.id('select-remount-test-trigger')).tap())

      // wait for select sheet/content to animate in
      await waitFor(element(by.id('select-remount-test-option-apple')))
        .toBeVisible()
        .withTimeout(10000)

      // select an option to close the Select (tap needs sync)
      await withSync(() => element(by.id('select-remount-test-option-apple')).tap())

      // wait for first sheet to fully close before interacting with second select
      await waitFor(element(by.id('select-remount-test-2-trigger')))
        .toBeVisible()
        .withTimeout(15000)

      // ensure element is interactive after sheet animation settles
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // test second Select (tap needs sync)
      await withSync(() => element(by.id('select-remount-test-2-trigger')).tap())
      await waitFor(element(by.id('select-remount-test-2-option-apple')))
        .toBeVisible()
        .withTimeout(10000)
    } finally {
      await device.enableSynchronization()
    }
  })
})
