/**
 * Setup gesture handler for Tamagui native components.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-gesture-handler'
 * ```
 *
 * This automatically detects and configures react-native-gesture-handler
 * for use with Sheet and other gesture-aware components.
 */

import { getGestureHandler } from './gestureState'

function setup() {
  const g = globalThis as any
  if (g.__tamagui_native_gesture_setup_complete) {
    return
  }
  g.__tamagui_native_gesture_setup_complete = true

  try {
    // dynamically require RNGH - it should already be imported by the app
    const rngh = require('react-native-gesture-handler')
    const { Gesture, GestureDetector, ScrollView } = rngh

    if (Gesture && GestureDetector) {
      getGestureHandler().set({
        enabled: true,
        Gesture,
        GestureDetector,
        ScrollView: ScrollView || null,
      })

      // also set on the legacy key for backward compat with @tamagui/sheet
      g.__tamagui_sheet_gesture_state__ = {
        enabled: true,
        Gesture,
        GestureDetector,
        ScrollView: ScrollView || null,
      }
    }
  } catch {
    // RNGH not available, that's fine
  }
}

// run setup immediately on import
setup()
