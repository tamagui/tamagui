/**
 * Native implementation of keyboard controller sheet hook.
 *
 * Simplified to just track keyboard state (height, visibility).
 * Position animation is handled by SheetImplementationCustom via
 * keyboard-adjusted positions — matching the react-native-actions-sheet pattern.
 *
 * Uses react-native-keyboard-controller events when available,
 * falls back to basic Keyboard API otherwise.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Keyboard, Platform } from 'react-native'
import type {
  KeyboardControllerSheetOptions,
  KeyboardControllerSheetResult,
} from './types'

// lazy import state accessors
let isKeyboardControllerEnabled: () => boolean = () => false
let getKeyboardControllerState: () => any = () => ({})

try {
  const nativeModule = require('@tamagui/native')
  isKeyboardControllerEnabled = nativeModule.isKeyboardControllerEnabled
  getKeyboardControllerState = nativeModule.getKeyboardControllerState
} catch {
  // @tamagui/native not available
}

export function useKeyboardControllerSheet(
  options: KeyboardControllerSheetOptions
): KeyboardControllerSheetResult {
  const { enabled } = options

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const keyboardControllerEnabled = isKeyboardControllerEnabled()

  // action-sheet pattern: pause keyboard hide events during drag
  // when true, keyboard hide events are ignored so isKeyboardVisible stays true
  // and activePositions don't revert mid-gesture
  const pauseKeyboardHandler = useRef(false)
  // tracks if a keyboard hide event was suppressed while paused
  const pendingHide = useRef(false)

  // dismiss keyboard helper
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss()
    if (keyboardControllerEnabled) {
      try {
        const { KeyboardController } = getKeyboardControllerState()
        KeyboardController?.dismiss?.()
      } catch {
        // ignore errors from keyboard-controller
      }
    }
  }, [keyboardControllerEnabled])

  // flush any keyboard hide that was suppressed during drag.
  // called when drag ends to reconcile actual keyboard state.
  const flushPendingHide = useCallback(() => {
    if (pendingHide.current) {
      pendingHide.current = false
      setIsKeyboardVisible(false)
      setKeyboardHeight(0)
    }
  }, [])

  // keyboard-controller event listeners (preferred when available)
  useEffect(() => {
    if (!enabled || !keyboardControllerEnabled) return

    const { KeyboardEvents } = getKeyboardControllerState()
    if (!KeyboardEvents?.addListener) return

    const showSub = KeyboardEvents.addListener('keyboardWillShow', (e: any) => {
      const height = e?.height ?? 0
      if (height > 0) {
        setKeyboardHeight(height)
      }
      setIsKeyboardVisible(true)
    })

    const hideSub = KeyboardEvents.addListener('keyboardWillHide', () => {
      if (pauseKeyboardHandler.current) {
        pendingHide.current = true
        return
      }
      setIsKeyboardVisible(false)
      setKeyboardHeight(0)
    })

    return () => {
      showSub?.remove?.()
      hideSub?.remove?.()
    }
  }, [enabled, keyboardControllerEnabled])

  // fallback to basic Keyboard API when keyboard-controller not available
  useEffect(() => {
    if (!enabled) return
    if (keyboardControllerEnabled) return

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showListener = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height)
      setIsKeyboardVisible(true)
    })

    const hideListener = Keyboard.addListener(hideEvent, () => {
      if (pauseKeyboardHandler.current) {
        pendingHide.current = true
        return
      }
      setIsKeyboardVisible(false)
      setKeyboardHeight(0)
    })

    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [enabled, keyboardControllerEnabled])

  return {
    keyboardControllerEnabled,
    keyboardHeight,
    isKeyboardVisible,
    dismissKeyboard,
    pauseKeyboardHandler,
    flushPendingHide,
  }
}
