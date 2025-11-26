/**
 * @deprecated Use native-testing module instead
 *
 * This file is kept for backwards compatibility.
 * All exports are re-exported from the native-testing module.
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
  tapTestId,
  hasTestId,
  // Navigation and scrolling
  goBack,
  scrollDown,
  scrollUp,
  scrollToText,
  scrollToTestId,
  // Utilities
  pause,
  getElementAttributes,
  // Types
  type Browser,
} from '../native-testing'
