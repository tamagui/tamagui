/**
 * Shared navigation utilities for Detox e2e tests
 * Uses the quick-nav grid in the collapsible section on home screen
 */

import { by, device, element, waitFor } from 'detox'
import { withSync } from './detox'

/**
 * Fast navigation to any test case using the quick-nav grid
 * Taps the toggle button to expand the section, then taps the target test case
 *
 * @param testCaseName - The exact name of the test case (e.g., 'SelectAndroidOnPress')
 * @param waitForElementId - Optional testID to wait for after navigation (confirms screen loaded)
 */
export async function navigateToTestCase(
  testCaseName: string,
  waitForElementId?: string,
  options?: { skipEnableSync?: boolean }
) {
  // disable sync to avoid animation driver blocking
  await device.disableSynchronization()

  // wait for home screen to load - generous because safeReloadApp triggers a
  // metro re-bundle that can exceed 60s on slow CI runners
  await waitFor(element(by.id('home-title')))
    .toExist()
    .withTimeout(180000)

  // small delay for UI to settle before tapping
  await new Promise((r) => setTimeout(r, 500))

  // tap toggle button to expand the quick-nav section
  await withSync(() => element(by.id('toggle-test-cases')).tap())

  // wait for the quick-nav element to appear
  await waitFor(element(by.id(`detox-nav-${testCaseName}`)))
    .toBeVisible()
    .withTimeout(15000)

  // tap the quick-nav element for this test case
  await withSync(() => element(by.id(`detox-nav-${testCaseName}`)).tap())

  // wait for stack screen transition animation to complete
  await new Promise((r) => setTimeout(r, 800))

  // wait for the target screen to load
  if (waitForElementId) {
    await waitFor(element(by.id(waitForElementId)))
      .toExist()
      .withTimeout(10000)
  }

  // re-enable sync (unless caller needs it disabled, e.g. no-RNGH tests)
  if (!options?.skipEnableSync) {
    await device.enableSynchronization()
  }
}

/**
 * Remount the active directUseCase component without a native app relaunch.
 *
 * Fires a `tamagui-kitchen-sink://remount` deep link, which DirectUseCaseHost
 * turns into a React key bump (full unmount + fresh mount of the case). This is
 * the per-test reset for launch-once test files: same fresh-state guarantee as
 * safeReloadApp, but it skips the native relaunch that is the sole trigger of
 * the Detox launch/connect flake (and costs ~300ms instead of ~30s).
 *
 * Readiness is gated on the off-screen e2e-remount-count incrementing, because
 * the keyed component swaps atomically and its own testIDs can't signal the swap.
 *
 * @param waitForElementId - optional testID to additionally wait for post-remount
 */
export async function remountDirectUseCase(
  waitForElementId?: string,
  options?: { skipEnableSync?: boolean }
) {
  // disable sync first: a busy animation/onLayout screen would otherwise hang
  // the openURL + attribute reads below.
  await device.disableSynchronization()

  const before = await readRemountCount()
  await device.openURL({ url: 'tamagui-kitchen-sink://remount' })

  await waitFor(element(by.id('e2e-remount-count')))
    .toHaveText(String(before + 1))
    .withTimeout(15000)

  // small settle for the fresh mount's first layout/animation frame
  await new Promise((r) => setTimeout(r, 300))

  if (waitForElementId) {
    await waitFor(element(by.id(waitForElementId)))
      .toExist()
      .withTimeout(15000)
  }

  if (!options?.skipEnableSync) {
    await device.enableSynchronization()
  }
}

async function readRemountCount(): Promise<number> {
  try {
    const attributes = (await element(by.id('e2e-remount-count')).getAttributes()) as any
    const value = Number.parseInt(attributes.text, 10)
    return Number.isNaN(value) ? 0 : value
  } catch {
    // counter not present yet (first reset right after launch) - treat as 0
    return 0
  }
}
