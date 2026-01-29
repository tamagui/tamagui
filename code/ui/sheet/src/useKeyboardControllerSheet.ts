/**
 * Web stub for keyboard controller sheet hook.
 * Returns no-op values since keyboard-controller is native-only.
 */

import { useRef } from 'react'
import type {
  KeyboardControllerSheetOptions,
  KeyboardControllerSheetResult,
} from './types'

const noop = () => {}

export function useKeyboardControllerSheet(
  _options: KeyboardControllerSheetOptions
): KeyboardControllerSheetResult {
  const pauseKeyboardHandler = useRef(false)
  return {
    keyboardControllerEnabled: false,
    keyboardHeight: 0,
    isKeyboardVisible: false,
    dismissKeyboard: noop,
    pauseKeyboardHandler,
    flushPendingHide: noop,
  }
}
