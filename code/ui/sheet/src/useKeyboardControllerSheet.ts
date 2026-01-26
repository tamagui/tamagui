/**
 * Web stub for keyboard controller sheet hook.
 * Returns null/no-op functions since keyboard-controller is native-only.
 */

import type {
  KeyboardControllerSheetOptions,
  KeyboardControllerSheetResult,
} from './types'

export function useKeyboardControllerSheet(
  _options: KeyboardControllerSheetOptions
): KeyboardControllerSheetResult {
  return {
    keyboardControllerEnabled: false,
    keyboardHeight: 0,
    isKeyboardVisible: false,
    dismissKeyboard: () => {},
  }
}
