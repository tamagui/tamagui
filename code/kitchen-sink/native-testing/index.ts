/**
 * Native Testing Framework
 *
 * A cross-platform testing framework for React Native apps using Appium + WebDriverIO.
 * Supports iOS and Android with unified APIs and platform-specific selectors.
 *
 * Usage:
 *   import {
 *     getNativeDriver,
 *     closeNativeDriver,
 *     findByTestId,
 *     waitForTestId,
 *     tapTestId,
 *     scrollDown,
 *     getPlatform,
 *     isIOS,
 *     isAndroid,
 *   } from './native-testing'
 *
 *   test('my test', async () => {
 *     const driver = await getNativeDriver()
 *     await tapTestId(driver, 'my-button')
 *     const element = await waitForTestId(driver, 'my-result')
 *     expect(await element.getText()).toBe('Success')
 *   })
 *
 *   afterAll(async () => {
 *     await closeNativeDriver()
 *   })
 */

export {
  // Core driver functions
  getNativeDriver,
  closeNativeDriver,
  type NativeDriver,
  // Platform detection
  getPlatform,
  isIOS,
  isAndroid,
  type Platform,
  // Element finding
  findByTestId,
  findByText,
  findByTextContaining,
  getTestIdSelector,
  // Waiting and interactions
  waitForElement,
  waitForTestId,
  waitForTestIdOrText,
  tapTestId,
  tapTestIdOrText,
  hasTestId,
  findByTestIdOrText,
  // Navigation and scrolling
  goBack,
  scrollDown,
  scrollUp,
  scrollToText,
  scrollToTestId,
  // Utilities
  pause,
  getElementAttributes,
} from './driver'

export { getWebDriverConfig, type WebdriverIOConfig } from './config'

// Re-export Browser type for convenience
export type { Browser } from 'webdriverio'
