/**
 * Setup keyboard controller for Tamagui native components.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@tamagui/native/setup-keyboard-controller'
 * ```
 *
 * This automatically detects and configures react-native-keyboard-controller
 * for use with Sheet and other keyboard-aware components.
 *
 * When enabled, Sheet gains:
 * - Frame-by-frame keyboard tracking (60/120 FPS)
 * - Smooth gesture + keyboard handoff
 * - Interactive keyboard dismiss on sheet drag
 */

import { setKeyboardControllerState } from './keyboardControllerState'

function setup() {
  const g = globalThis as any
  if (g.__tamagui_native_keyboard_controller_setup_complete) {
    return
  }
  g.__tamagui_native_keyboard_controller_setup_complete = true

  try {
    // dynamically require keyboard-controller - it should already be imported by the app
    const rnkc = require('react-native-keyboard-controller')
    const {
      KeyboardProvider,
      KeyboardAwareScrollView,
      useKeyboardHandler,
      useReanimatedKeyboardAnimation,
      KeyboardController,
      KeyboardStickyView,
    } = rnkc

    if (useKeyboardHandler && KeyboardProvider) {
      setKeyboardControllerState({
        enabled: true,
        KeyboardProvider: KeyboardProvider || null,
        KeyboardAwareScrollView: KeyboardAwareScrollView || null,
        useKeyboardHandler: useKeyboardHandler || null,
        useReanimatedKeyboardAnimation: useReanimatedKeyboardAnimation || null,
        KeyboardController: KeyboardController || null,
        KeyboardStickyView: KeyboardStickyView || null,
      })
    }
  } catch {
    // keyboard-controller not available, that's fine
  }
}

// run setup immediately on import
setup()
