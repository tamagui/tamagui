/**
 * Test for issue #1859: Select not working when mounted, unmounted, and mounted again
 * https://github.com/tamagui/tamagui/issues/1859
 */

import { expect, test, afterAll } from 'vitest'
import {
  getNativeDriver,
  closeNativeDriver,
  waitForTestId,
  waitForTestIdOrText,
  tapTestId,
  tapTestIdOrText,
  hasTestId,
  pause,
  findByText,
  findByTextContaining,
  scrollToText,
  isAndroid,
} from '../native-testing'

// Longer timeout for CI where session creation can take 5+ mins
const testOptions = { timeout: 180_000, retry: 2 }

// Skip on Android - the emulator is too slow/unreliable for complex navigation tests
// TODO: Debug Android navigation issues separately
const skipOnAndroid = isAndroid()

let navigatedToTestCase = false

async function navigateToSelectRemount() {
  if (navigatedToTestCase) return

  const driver = await getNativeDriver()

  // Wait for app to load
  const title = await findByTextContaining(driver, 'Kitchen Sink')
  await title.waitForDisplayed({ timeout: 60_000 })

  // Navigate to Test Cases
  const testCasesLink = await findByText(driver, 'Test Cases')
  await testCasesLink.waitForDisplayed({ timeout: 15_000 })
  await testCasesLink.click()
  await pause(1000)

  // Find and tap SelectRemount in the list
  const selectRemountLink = await scrollToText(driver, 'SelectRemount', 15)
  await selectRemountLink.click()
  await pause(1500)

  navigatedToTestCase = true
}

afterAll(async () => {
  await closeNativeDriver()
})

test.skipIf(skipOnAndroid)('Navigate to SelectRemount test case', testOptions, async () => {
  await navigateToSelectRemount()

  // Verify we're on the right screen by checking for the remount button (longer timeout for CI)
  // Use text fallback on Android since Tamagui may not expose testID correctly
  const driver = await getNativeDriver()
  const remountButton = await waitForTestIdOrText(driver, 'remount-button', 'Remount', 30_000)
  expect(await remountButton.isDisplayed()).toBe(true)
})

test.skipIf(skipOnAndroid)('Select opens on first mount', testOptions, async () => {
  await navigateToSelectRemount()
  const driver = await getNativeDriver()

  const selectTrigger = await waitForTestId(driver, 'select-remount-test-trigger', 10_000)
  await selectTrigger.click()
  await pause(1000)

  const hasApple = await hasTestId(driver, 'select-remount-test-option-apple')
  expect(hasApple).toBe(true)

  // Close Select by tapping outside
  const { width } = await driver.getWindowSize()
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: Math.round(width / 2), y: 100 })
    .down()
    .up()
    .perform()

  await pause(1000)
})

test.skipIf(skipOnAndroid)('Select opens after unmount/remount cycle', testOptions, async () => {
  await navigateToSelectRemount()
  const driver = await getNativeDriver()

  // Wait a bit for any previous Select animations to complete
  await pause(500)

  // Tap remount button to unmount and remount the Select
  // Use text fallback on Android since Tamagui may not expose testID correctly
  await tapTestIdOrText(driver, 'remount-button', 'Remount', 30_000)
  await pause(1500)

  // Try to open the Select again - THIS IS THE KEY TEST for #1859
  const selectTrigger = await waitForTestId(driver, 'select-remount-test-trigger', 15_000)
  await selectTrigger.click()
  await pause(1000)

  const hasApple = await hasTestId(driver, 'select-remount-test-option-apple')
  expect(hasApple).toBe(true)

  // Close Select by tapping outside
  const { width } = await driver.getWindowSize()
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: Math.round(width / 2), y: 100 })
    .down()
    .up()
    .perform()

  await pause(1000)
})

test.skipIf(skipOnAndroid)('Multiple Selects work after remount', testOptions, async () => {
  await navigateToSelectRemount()
  const driver = await getNativeDriver()

  // Wait a bit for any previous Select animations to complete
  await pause(500)

  // Tap remount to reset state
  // Use text fallback on Android since Tamagui may not expose testID correctly
  await tapTestIdOrText(driver, 'remount-button', 'Remount', 30_000)
  await pause(1500)

  // Test first Select
  const firstTrigger = await waitForTestId(driver, 'select-remount-test-trigger', 15_000)
  await firstTrigger.click()
  await pause(1000)

  let hasOption = await hasTestId(driver, 'select-remount-test-option-apple')
  expect(hasOption).toBe(true)

  // Close first Select by tapping outside
  const { width } = await driver.getWindowSize()
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: Math.round(width / 2), y: 100 })
    .down()
    .up()
    .perform()
  await pause(1000)

  // Test second Select
  const secondTrigger = await waitForTestId(driver, 'select-remount-test-2-trigger', 15_000)
  await secondTrigger.click()
  await pause(1000)

  hasOption = await hasTestId(driver, 'select-remount-test-2-option-apple')
  expect(hasOption).toBe(true)
})
