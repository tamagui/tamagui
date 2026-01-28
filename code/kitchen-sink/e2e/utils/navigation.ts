/**
 * Shared navigation utilities for Detox e2e tests
 * Navigates through home screen -> test cases list -> specific test case
 */

import { by, device, element, waitFor } from 'detox'

/**
 * Navigate to any test case through the standard navigation flow
 * Home -> Test Cases -> Specific test case
 *
 * @param testCaseName - The exact name of the test case (e.g., 'PointerEventsCase')
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

  // tap "Test Cases" link on home screen
  await element(by.id('home-test-cases-link')).tap()

  // wait for test cases screen to load
  await waitFor(element(by.id('test-cases-scroll-view')))
    .toExist()
    .withTimeout(10000)

  // small delay for the list to render fully
  await new Promise((r) => setTimeout(r, 500))

  // scroll to find and tap the specific test case
  const testCaseElement = element(by.id(`test-case-${testCaseName}`))
  const scrollView = element(by.id('test-cases-scroll-view'))

  // try scrolling multiple times to find the element
  let found = false
  const maxScrolls = 20
  for (let i = 0; i < maxScrolls && !found; i++) {
    try {
      // check if element exists and is at least partially visible
      await expect(testCaseElement).toExist()
      await testCaseElement.tap()
      found = true
    } catch {
      // scroll down and try again
      await scrollView.scroll(400, 'down')
      await new Promise((r) => setTimeout(r, 100))
    }
  }

  if (!found) {
    throw new Error(`Could not find test case: ${testCaseName} after ${maxScrolls} scroll attempts`)
  }

  // wait for the target screen to load
  if (waitForElementId) {
    await waitFor(element(by.id(waitForElementId)))
      .toExist()
      .withTimeout(10000)
  }

  // re-enable sync
  await device.enableSynchronization()
}
