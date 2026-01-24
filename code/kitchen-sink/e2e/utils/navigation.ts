/**
 * Shared navigation utilities for Detox e2e tests
 * Uses the quick-nav grid in the collapsible section on home screen
 */

import { by, device, element, waitFor } from 'detox'

/**
 * Fast navigation to any test case using the quick-nav grid
 * Taps the toggle button to expand the section, then taps the target test case
 *
 * @param testCaseName - The exact name of the test case (e.g., 'SelectAndroidOnPress')
 * @param waitForElementId - Optional testID to wait for after navigation (confirms screen loaded)
 */
export async function navigateToTestCase(
  testCaseName: string,
  waitForElementId?: string
) {
  // disable sync to avoid animation driver blocking
  await device.disableSynchronization()

  // wait for home screen to load
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(60000)

  // small delay for UI to settle before tapping
  await new Promise((r) => setTimeout(r, 500))

  // tap toggle button to expand the quick-nav section
  await element(by.id('toggle-test-cases')).tap()

  // small delay for expansion
  await new Promise((r) => setTimeout(r, 300))

  // tap the quick-nav element for this test case
  await element(by.id(`detox-nav-${testCaseName}`)).tap()

  // wait for the target screen to load
  if (waitForElementId) {
    await waitFor(element(by.id(waitForElementId)))
      .toExist()
      .withTimeout(10000)
  }

  // re-enable sync
  await device.enableSynchronization()
}
