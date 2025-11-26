/**
 * Sample cross-platform native test
 *
 * This test runs on both iOS and Android. It demonstrates the basic pattern
 * for writing native tests using the shared test utilities.
 */

import { expect, test, afterAll } from 'vitest'
import {
  getNativeDriver,
  closeNativeDriver,
  findByText,
  waitForTestId,
  getPlatform,
  isIOS,
  isAndroid,
  pause,
} from '../native-testing'

const sharedTestOptions = { timeout: 60_000, retry: 2 }

afterAll(async () => {
  await closeNativeDriver()
})

test('Kitchen Sink app launches and shows title', sharedTestOptions, async () => {
  const driver = await getNativeDriver()
  const platform = getPlatform()

  console.info(`Running on platform: ${platform}`)

  // Find the Kitchen Sink title
  const titleElement = await findByText(driver, 'Kitchen Sink')
  await titleElement.waitForDisplayed({ timeout: 30_000 })

  expect(await titleElement.isDisplayed()).toBe(true)
})

test('Can identify platform correctly', sharedTestOptions, async () => {
  const platform = getPlatform()

  // At least one should be true
  expect(isIOS() || isAndroid()).toBe(true)

  // They should be mutually exclusive
  expect(isIOS() && isAndroid()).toBe(false)

  // Platform should match
  if (isIOS()) {
    expect(platform).toBe('ios')
  } else {
    expect(platform).toBe('android')
  }
})
