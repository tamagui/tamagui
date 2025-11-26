/**
 * @deprecated Use native-testing module instead
 *
 * This file is kept for backwards compatibility.
 * It re-exports the WebDriver configuration from the native-testing module.
 */

export { getWebDriverConfig, type WebdriverIOConfig } from '../native-testing'

// Backwards compatibility alias
export { getWebDriverConfig as getAndroidWebDriverConfig } from '../native-testing'
