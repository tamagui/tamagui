/**
 * Setup gesture handler for Tamagui native components.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * // auto-setup with all features enabled
 * import '@tamagui/native/setup-gesture-handler'
 *
 * // or configure selectively
 * import { setupGestureHandler } from '@tamagui/native/setup-gesture-handler'
 * setupGestureHandler({ pressEvents: true, sheet: false })
 * ```
 *
 * This automatically detects and configures react-native-gesture-handler
 * for use with Sheet and other gesture-aware components.
 */

import { getGestureHandler } from './gestureState'

export interface GestureHandlerConfig {
  /** use RNGH for press events on Tamagui components (default: true) */
  pressEvents?: boolean
  /** use RNGH for Sheet drag gestures (default: true) */
  sheet?: boolean
}

let currentConfig: GestureHandlerConfig = {
  pressEvents: true,
  sheet: true,
}

export function getGestureHandlerConfig(): GestureHandlerConfig {
  return currentConfig
}

export function setupGestureHandler(config?: GestureHandlerConfig): void {
  const g = globalThis as any

  // override config if provided
  if (config) {
    currentConfig = config
  }

  // allow re-running setup to change config
  const isFirstRun = !g.__tamagui_native_gesture_setup_complete
  g.__tamagui_native_gesture_setup_complete = true

  try {
    // dynamically require RNGH - it should already be imported by the app
    const rngh = require('react-native-gesture-handler')
    const { Gesture, GestureDetector, ScrollView } = rngh

    if (Gesture && GestureDetector) {
      // only enable if pressEvents is true
      getGestureHandler().set({
        enabled: currentConfig.pressEvents !== false,
        Gesture,
        GestureDetector,
        ScrollView: ScrollView || null,
      })

      // sheet state - only enable if sheet is true
      g.__tamagui_sheet_gesture_state__ = {
        enabled: currentConfig.sheet !== false,
        Gesture,
        GestureDetector,
        ScrollView: ScrollView || null,
      }
    }
  } catch {
    // RNGH not available, that's fine
  }
}

// run setup immediately on import (can be overridden by calling setupGestureHandler)
setupGestureHandler()
