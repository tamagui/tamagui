/**
 * Test for issue #1859: Select not working when mounted, unmounted, and mounted again
 * https://github.com/tamagui/tamagui/issues/1859
 *
 * This test verifies that the Select component works correctly after being
 * unmounted and remounted.
 */

import { expect, test, afterAll, beforeAll } from 'vitest'
import {
  getNativeDriver,
  closeNativeDriver,
  waitForTestId,
  tapTestId,
  hasTestId,
  pause,
  findByText,
  findByTextContaining,
  scrollToText,
} from '../testing-utils/native-driver'

const testOptions = { timeout: 120_000, retry: 1 }

let navigatedToTestCase = false

async function navigateToSelectRemount() {
  if (navigatedToTestCase) return

  const driver = await getNativeDriver()

  // Wait for app to load - look for "Kitchen Sink" title
  console.info('Waiting for app to load...')
  const title = await findByTextContaining(driver, 'Kitchen Sink')
  await title.waitForDisplayed({ timeout: 30_000 })
  console.info('App loaded')

  // Navigate to Test Cases
  console.info('Navigating to Test Cases...')
  const testCasesLink = await findByText(driver, 'Test Cases')
  await testCasesLink.waitForDisplayed({ timeout: 10_000 })
  await testCasesLink.click()
  await pause(1000)

  // Find and tap SelectRemount in the list - scroll to find it since it's far down
  console.info('Looking for SelectRemount test case (scrolling to find it)...')
  const selectRemountLink = await scrollToText(driver, 'SelectRemount', 15)
  await selectRemountLink.click()
  await pause(1500)

  console.info('Navigated to SelectRemount test case')
  navigatedToTestCase = true
}

afterAll(async () => {
  await closeNativeDriver()
})

test('Navigate to SelectRemount test case', testOptions, async () => {
  await navigateToSelectRemount()

  // Verify we're on the right screen by checking for the remount button
  const driver = await getNativeDriver()
  const remountButton = await waitForTestId(driver, 'remount-button', 10_000)
  expect(await remountButton.isDisplayed()).toBe(true)
})

test('Select opens on first mount', testOptions, async () => {
  await navigateToSelectRemount()
  const driver = await getNativeDriver()

  // Find and tap the Select trigger
  console.info('Testing Select opens on first mount...')
  const selectTrigger = await waitForTestId(driver, 'select-remount-test-trigger', 10_000)
  await selectTrigger.click()

  await pause(1000)

  // Verify the Select opened by checking for an option
  const hasApple = await hasTestId(driver, 'select-remount-test-option-apple')
  console.info(`Select opened: ${hasApple}`)
  expect(hasApple).toBe(true)

  // Close the Select by tapping outside (use y=100 to avoid the back button area)
  const { width, height } = await driver.getWindowSize()
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: Math.round(width / 2), y: 100 })
    .down()
    .up()
    .perform()

  await pause(1000)
})

test('Select opens after unmount/remount cycle', testOptions, async () => {
  await navigateToSelectRemount()
  const driver = await getNativeDriver()

  // Tap the remount button to unmount and remount the Select
  console.info('Testing Select after remount...')
  await tapTestId(driver, 'remount-button', 10_000)

  // Wait for the remount to complete
  await pause(1000)

  // Try to open the Select again - THIS IS THE KEY TEST
  const selectTrigger = await waitForTestId(driver, 'select-remount-test-trigger', 15_000)
  await selectTrigger.click()

  await pause(1000)

  // Verify the Select opened (this would fail with the bug in #1859)
  const hasApple = await hasTestId(driver, 'select-remount-test-option-apple')
  console.info(`Select opened after remount: ${hasApple}`)

  expect(hasApple).toBe(true)

  // Close the Select by tapping outside (use y=100 to avoid the back button area)
  const { width } = await driver.getWindowSize()
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: Math.round(width / 2), y: 100 })
    .down()
    .up()
    .perform()

  await pause(1000)
})

test('Multiple Selects work after remount', testOptions, async () => {
  await navigateToSelectRemount()
  const driver = await getNativeDriver()

  // Tap remount to reset state
  console.info('Testing multiple Selects after remount...')
  await tapTestId(driver, 'remount-button', 10_000)
  await pause(1000)

  // Test first Select
  const firstTrigger = await waitForTestId(driver, 'select-remount-test-trigger', 15_000)
  await firstTrigger.click()
  await pause(1000)

  let hasOption = await hasTestId(driver, 'select-remount-test-option-apple')
  console.info(`First Select opened: ${hasOption}`)
  expect(hasOption).toBe(true)

  // Close first Select by tapping outside (use y=100 to avoid the back button area)
  const { width } = await driver.getWindowSize()
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: Math.round(width / 2), y: 100 })
    .down()
    .up()
    .perform()
  await pause(1000)

  // Test second Select
  const secondTrigger = await waitForTestId(
    driver,
    'select-remount-test-2-trigger',
    15_000
  )
  await secondTrigger.click()
  await pause(1000)

  hasOption = await hasTestId(driver, 'select-remount-test-2-option-apple')
  console.info(`Second Select opened: ${hasOption}`)
  expect(hasOption).toBe(true)
})
