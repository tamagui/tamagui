import { expect, test, afterAll } from 'vitest'
import {
  getNativeDriver,
  closeNativeDriver,
  scrollToText,
  findByTestId,
  tapTestId,
  findByText,
  pause,
} from '../native-testing'

const sharedTestOptions = { timeout: 10 * 60 * 1000, retry: 3 }

afterAll(async () => {
  await closeNativeDriver()
})

test('Checkbox disabled should not trigger onPress', sharedTestOptions, async () => {
  const driver = await getNativeDriver()

  // Navigate to Test Cases
  const testCasesLink = await scrollToText(driver, 'Test Cases')
  await testCasesLink.click()
  await pause(500)

  // Navigate to CheckboxDisabledOnPress test case
  const testCase = await scrollToText(driver, 'CheckboxDisabledOnPress')
  await testCase.click()
  await pause(500)

  // Verify initial state - both counts should be 0
  const enabledCount = await findByTestId(driver, 'enabled-press-count')
  const enabledText = await enabledCount.getText()
  expect(enabledText).toContain('0')

  const disabledCount = await findByTestId(driver, 'disabled-press-count')
  const disabledText = await disabledCount.getText()
  expect(disabledText).toContain('0')

  // Tap the enabled checkbox - count should increment
  await tapTestId(driver, 'enabled-checkbox')
  await pause(300)

  const enabledCountAfter = await findByTestId(driver, 'enabled-press-count')
  const enabledTextAfter = await enabledCountAfter.getText()
  expect(enabledTextAfter).toContain('1')

  // Tap the disabled checkbox - count should NOT increment
  await tapTestId(driver, 'disabled-checkbox')
  await pause(300)

  const disabledCountAfter = await findByTestId(driver, 'disabled-press-count')
  const disabledTextAfter = await disabledCountAfter.getText()
  // This is the key assertion - disabled checkbox onPress should NOT be called
  expect(disabledTextAfter).toContain('0')
})
