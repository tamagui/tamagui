/**
 * Shared navigation utilities for Detox e2e tests
 * Uses the DetoxQuickNav grid on the home screen for fast navigation
 */

import { by, element, waitFor } from 'detox'

/**
 * Fast navigation to any test case using the hidden quick-nav grid
 * This is ~10x faster than the old method of tapping through menus and scrolling
 *
 * @param testCaseName - The exact name of the test case (e.g., 'SelectAndroidOnPress')
 * @param waitForElementId - Optional testID to wait for after navigation (confirms screen loaded)
 */
export async function navigateToTestCase(
  testCaseName: string,
  waitForElementId?: string
) {
  // wait for home screen to load
  await waitFor(element(by.text('Kitchen Sink')))
    .toExist()
    .withTimeout(60000)

  // tap the quick-nav element for this test case
  await element(by.id(`detox-nav-${testCaseName}`)).tap()

  // wait for the target screen to load
  if (waitForElementId) {
    await waitFor(element(by.id(waitForElementId)))
      .toExist()
      .withTimeout(10000)
  }
}
