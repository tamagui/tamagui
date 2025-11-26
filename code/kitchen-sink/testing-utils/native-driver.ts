/**
 * Cross-platform native test driver
 *
 * This module provides a unified API for writing native tests that run on both iOS and Android.
 * Tests use WebDriverIO with Appium under the hood.
 *
 * Usage:
 *   import { getNativeDriver, Platform, isIOS, isAndroid } from '../testing-utils/native-driver'
 *
 *   test('my test', async () => {
 *     const driver = await getNativeDriver()
 *     const element = await driver.$('~my-element')
 *     await element.click()
 *   })
 */

import { remote, type Browser } from 'webdriverio'
import { getWebDriverConfig } from './getWebDriverConfig'
import { getAndroidWebDriverConfig } from './getWebDriverConfig.android'

export type NativeDriver = Browser

// Determine which platform we're testing
export type Platform = 'ios' | 'android'

export function getPlatform(): Platform {
  // Check explicit env var
  if (process.env.NATIVE_TEST_PLATFORM === 'android') {
    return 'android'
  }
  // Check for Android-specific env vars
  if (process.env.ANDROID_TEST_APK_PATH || process.env.ANDROID_EMULATOR_NAME) {
    return 'android'
  }
  // Default to iOS
  return 'ios'
}

export function isIOS(): boolean {
  return getPlatform() === 'ios'
}

export function isAndroid(): boolean {
  return getPlatform() === 'android'
}

// Singleton driver instance per test file
let driverInstance: NativeDriver | null = null
let driverPlatform: Platform | null = null

/**
 * Get a WebDriverIO driver instance for the current platform.
 * The driver is cached and reused within a test file.
 */
export async function getNativeDriver(): Promise<NativeDriver> {
  const platform = getPlatform()

  // If we have a driver for a different platform, close it
  if (driverInstance && driverPlatform !== platform) {
    await driverInstance.deleteSession()
    driverInstance = null
    driverPlatform = null
  }

  if (!driverInstance) {
    const config =
      platform === 'android'
        ? await getAndroidWebDriverConfig()
        : await getWebDriverConfig()

    driverInstance = await remote(config)
    driverPlatform = platform
  }

  return driverInstance
}

/**
 * Close the driver session. Call this in afterAll() or when switching platforms.
 */
export async function closeNativeDriver(): Promise<void> {
  if (driverInstance) {
    await driverInstance.deleteSession()
    driverInstance = null
    driverPlatform = null
  }
}

/**
 * Helper to find elements by accessibility ID (testID on React Native).
 * On iOS, uses accessibility id. On Android, uses content-desc.
 */
export async function findByTestId(
  driver: NativeDriver,
  testId: string
): Promise<ReturnType<NativeDriver['$']>> {
  // ~ prefix works for both iOS and Android accessibility ID
  return driver.$(`~${testId}`)
}

/**
 * Helper to find elements by text content.
 * Uses platform-specific selectors.
 */
export async function findByText(
  driver: NativeDriver,
  text: string
): Promise<ReturnType<NativeDriver['$']>> {
  if (isIOS()) {
    return driver.$(`-ios predicate string:label == "${text}" OR value == "${text}"`)
  } else {
    return driver.$(`android=new UiSelector().text("${text}")`)
  }
}

/**
 * Helper to find elements containing text.
 */
export async function findByTextContaining(
  driver: NativeDriver,
  text: string
): Promise<ReturnType<NativeDriver['$']>> {
  if (isIOS()) {
    return driver.$(
      `-ios predicate string:label CONTAINS "${text}" OR value CONTAINS "${text}"`
    )
  } else {
    return driver.$(`android=new UiSelector().textContains("${text}")`)
  }
}

/**
 * Wait for an element to be visible and return it.
 */
export async function waitForElement(
  driver: NativeDriver,
  selector: string,
  timeout = 10000
): Promise<ReturnType<NativeDriver['$']>> {
  const element = await driver.$(selector)
  await element.waitForDisplayed({ timeout })
  return element
}

/**
 * Wait for an element by testID to be visible and return it.
 */
export async function waitForTestId(
  driver: NativeDriver,
  testId: string,
  timeout = 10000
): Promise<ReturnType<NativeDriver['$']>> {
  return waitForElement(driver, `~${testId}`, timeout)
}

/**
 * Tap on an element by testID.
 */
export async function tapTestId(
  driver: NativeDriver,
  testId: string,
  timeout = 10000
): Promise<void> {
  const element = await waitForTestId(driver, testId, timeout)
  await element.click()
}

/**
 * Check if an element with testID exists (is displayed).
 */
export async function hasTestId(driver: NativeDriver, testId: string): Promise<boolean> {
  try {
    const element = await driver.$(`~${testId}`)
    return await element.isDisplayed()
  } catch {
    return false
  }
}

/**
 * Get all attributes of an element (useful for debugging).
 */
export async function getElementAttributes(
  element: Awaited<ReturnType<NativeDriver['$']>>
): Promise<Record<string, string>> {
  const platform = getPlatform()

  if (platform === 'ios') {
    // iOS: get common attributes
    const attrs: Record<string, string> = {}
    try {
      attrs.label = (await element.getAttribute('label')) || ''
      attrs.value = (await element.getAttribute('value')) || ''
      attrs.name = (await element.getAttribute('name')) || ''
      attrs.type = (await element.getAttribute('type')) || ''
    } catch {
      // ignore
    }
    return attrs
  } else {
    // Android: get common attributes
    const attrs: Record<string, string> = {}
    try {
      attrs.text = (await element.getAttribute('text')) || ''
      attrs.contentDesc = (await element.getAttribute('content-desc')) || ''
      attrs.className = (await element.getAttribute('class')) || ''
      attrs.resourceId = (await element.getAttribute('resource-id')) || ''
    } catch {
      // ignore
    }
    return attrs
  }
}

/**
 * Navigate back (press back button).
 */
export async function goBack(driver: NativeDriver): Promise<void> {
  if (isAndroid()) {
    await driver.back()
  } else {
    // iOS: try to find and tap a back button, or use gesture
    try {
      const backButton = await driver.$('~back-button')
      if (await backButton.isDisplayed()) {
        await backButton.click()
        return
      }
    } catch {
      // ignore
    }

    // Swipe from left edge to go back using W3C WebDriver action API
    const { width, height } = await driver.getWindowSize()
    const startX = 10
    const startY = Math.round(height / 2)
    const endX = Math.round(width / 2)

    await driver
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x: startX, y: startY })
      .down()
      .pause(100)
      .move({ x: endX, y: startY, duration: 200 })
      .up()
      .perform()
  }
}

/**
 * Pause execution for debugging.
 */
export async function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Scroll down on the screen.
 */
export async function scrollDown(driver: NativeDriver, distance = 500): Promise<void> {
  const { width, height } = await driver.getWindowSize()

  if (isIOS()) {
    // Use mobile: scroll for iOS which works better with native ScrollViews
    await driver.execute('mobile: scroll', {
      direction: 'down',
    })
  } else {
    // Android: use the new action API (W3C WebDriver standard)
    // Use a larger scroll distance for more effective scrolling
    const startX = Math.round(width / 2)
    const startY = Math.round(height * 0.75)
    const endY = Math.round(height * 0.25)

    await driver
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x: startX, y: startY })
      .down()
      .pause(100)
      .move({ x: startX, y: endY, duration: 300 })
      .up()
      .perform()
  }
}

/**
 * Scroll up on the screen.
 */
export async function scrollUp(driver: NativeDriver, distance = 300): Promise<void> {
  const { width, height } = await driver.getWindowSize()

  if (isIOS()) {
    // Use mobile: scroll for iOS which works better with native ScrollViews
    await driver.execute('mobile: scroll', {
      direction: 'up',
    })
  } else {
    // Android: use the new action API (W3C WebDriver standard)
    const startX = Math.round(width / 2)
    const startY = Math.round(height * 0.3)
    const endY = Math.round(startY + distance)

    await driver
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x: startX, y: startY })
      .down()
      .pause(100)
      .move({ x: startX, y: endY, duration: 200 })
      .up()
      .perform()
  }
}

/**
 * Scroll until an element with the given text is visible.
 * Returns the element when found, or throws after maxScrolls attempts.
 */
export async function scrollToText(
  driver: NativeDriver,
  text: string,
  maxScrolls = 10
): Promise<ReturnType<NativeDriver['$']>> {
  for (let i = 0; i < maxScrolls; i++) {
    // Quick check if element exists (no waiting)
    const element = await findByText(driver, text)
    const exists = await element.isExisting()

    if (exists) {
      console.info(`scrollToText: "${text}" found after ${i} scrolls`)
      return element
    }

    // Scroll and continue
    await scrollDown(driver)
    await pause(200) // Brief pause for scroll to settle
  }

  // One last try after all scrolls
  console.info(`scrollToText: Final check for "${text}"`)
  const element = await findByText(driver, text)
  await element.waitForExist({ timeout: 3000 })
  return element
}

/**
 * Scroll until an element with the given testID is visible.
 * Returns the element when found, or throws after maxScrolls attempts.
 */
export async function scrollToTestId(
  driver: NativeDriver,
  testId: string,
  maxScrolls = 10
): Promise<ReturnType<NativeDriver['$']>> {
  for (let i = 0; i < maxScrolls; i++) {
    try {
      const element = await driver.$(`~${testId}`)
      if (await element.isDisplayed()) {
        return element
      }
    } catch {
      // Element not found yet, continue scrolling
    }

    await scrollDown(driver)
    await pause(300)
  }

  // One last try after all scrolls
  const element = await driver.$(`~${testId}`)
  await element.waitForDisplayed({ timeout: 2000 })
  return element
}

// Re-export types for convenience
export type { Browser } from 'webdriverio'
