/**
 * Constants for @tamagui/native-ci
 */

// Metro bundler configuration
export const METRO_HOST = '127.0.0.1'
export const METRO_PORT = 8081
export const METRO_URL = `http://${METRO_HOST}:${METRO_PORT}`

// Detox server port (used for test communication)
export const DETOX_SERVER_PORT = 8099

// Default timeouts and intervals
export const DEFAULT_METRO_WAIT_ATTEMPTS = 60
export const DEFAULT_METRO_WAIT_INTERVAL_MS = 2000
export const DEFAULT_METRO_TIMEOUT_MS =
  DEFAULT_METRO_WAIT_ATTEMPTS * DEFAULT_METRO_WAIT_INTERVAL_MS // 120s

// KV cache configuration
export const DEFAULT_KV_TTL_SECONDS = 2592000 // 30 days

// Supported platforms
export type Platform = 'ios' | 'android'

// Expo manifest response type
export interface ExpoManifest {
  launchAsset?: {
    url?: string
  }
}
