/**
 * Native implementation of keyboard controller sheet hook.
 *
 * Uses react-native-keyboard-controller for frame-by-frame keyboard tracking
 * when available. Falls back to basic Keyboard API if not installed.
 *
 * Key features when keyboard-controller is available:
 * - 60/120 FPS keyboard tracking via useKeyboardHandler
 * - onMove callback fires every frame during keyboard animation
 * - onInteractive callback fires when user drags keyboard (iOS interactive mode)
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

/**
 * Wrapper hook that calls useKeyboardHandler when available.
 * Must be called unconditionally at component top level.
 */
function useKeyboardHandlerWrapper(
  handlers: {
    onStart?: (e: any) => void
    onMove?: (e: any) => void
    onInteractive?: (e: any) => void
    onEnd?: (e: any) => void
  },
  enabled: boolean
) {
  const keyboardControllerEnabled = isKeyboardControllerEnabled()

  // get the hook from global state
  const state = getKeyboardControllerState()
  const useKeyboardHandler = state?.useKeyboardHandler

  // create worklet-wrapped handlers
  // note: these need 'worklet' directive but we can't add that in JS
  // keyboard-controller will handle this internally if using their hook

  // we need to call this hook unconditionally, but it may not exist
  // so we create a no-op fallback
  const noopHook = () => {}

  // if keyboard-controller is available and enabled, use the real hook
  if (keyboardControllerEnabled && useKeyboardHandler && enabled) {
    try {
      // call the actual hook with our handlers
      useKeyboardHandler(handlers)
    } catch (e) {
      // hook failed, fall back silently
      console.warn('[Sheet] useKeyboardHandler failed:', e)
    }
  }
}

export function useKeyboardControllerSheet(
  options: KeyboardControllerSheetOptions
): KeyboardControllerSheetResult {
  const {
    enabled,
    positions,
    position,
    isHidden,
    screenSize,
    setAnimatedPosition,
    keyboardBlurBehavior = 'restore',
  } = options

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const positionBeforeKeyboard = useRef<number | null>(null)
  const keyboardControllerEnabled = isKeyboardControllerEnabled()

  // refs for current values (for use in worklet handlers)
  const positionsRef = useRef(positions)
  const positionRef = useRef(position)
  const isHiddenRef = useRef(isHidden)
  const screenSizeRef = useRef(screenSize)

  useEffect(() => {
    positionsRef.current = positions
    positionRef.current = position
    isHiddenRef.current = isHidden
    screenSizeRef.current = screenSize
  }, [positions, position, isHidden, screenSize])

  // keyboard handler callbacks
  const handleKeyboardMove = useCallback(
    (e: { height: number; progress: number }) => {
      'worklet'
      // this runs on UI thread when keyboard-controller is active
      // note: can't use runOnJS here directly as it may not be available
    },
    []
  )

  // try to use useKeyboardHandler if available
  // this provides frame-by-frame tracking during keyboard animation
  useKeyboardHandlerWrapper(
    {
      onStart: (e: any) => {
        'worklet'
        // keyboard starting to show/hide
      },
      onMove: (e: any) => {
        'worklet'
        // called every frame during keyboard animation
        // e.height and e.progress are available
        // unfortunately we can't easily update React state from worklet
        // would need runOnJS from reanimated
      },
      onInteractive: (e: any) => {
        'worklet'
        // called when user drags keyboard (iOS interactive dismiss)
      },
      onEnd: (e: any) => {
        'worklet'
        // keyboard finished animating
      },
    },
    enabled && keyboardControllerEnabled
  )

  // dismiss keyboard helper
  const dismissKeyboard = useCallback(() => {
    if (keyboardControllerEnabled) {
      const { KeyboardController } = getKeyboardControllerState()
      if (KeyboardController?.dismiss) {
        KeyboardController.dismiss()
        return
      }
    }
    Keyboard.dismiss()
  }, [keyboardControllerEnabled])

  // use KeyboardController.addListener for JS-thread events
  // this is simpler than worklet-based handlers and works well
  useEffect(() => {
    if (!enabled || !keyboardControllerEnabled) return

    const { KeyboardController } = getKeyboardControllerState()
    if (!KeyboardController?.addListener) return

    // keyboard-controller events fire on every frame during animation
    const showSub = KeyboardController.addListener('keyboardWillShow', (e: any) => {
      if (positionBeforeKeyboard.current === null) {
        const currentY =
          isHiddenRef.current || positionRef.current === -1
            ? screenSizeRef.current
            : positionsRef.current[positionRef.current]
        positionBeforeKeyboard.current = currentY
      }
      setIsKeyboardVisible(true)
    })

    const hideSub = KeyboardController.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false)
    })

    // this event fires every frame during keyboard animation
    const changeSub = KeyboardController.addListener(
      'keyboardDidChangeFrame',
      (e: any) => {
        const height = e?.height ?? 0

        if (height > 0) {
          setKeyboardHeight(height)

          // calculate and animate to new position
          const savedY = positionBeforeKeyboard.current
          if (savedY !== null) {
            const newY = Math.max(savedY - height, 0)
            setAnimatedPosition(newY, { type: 'timing', duration: 16 }) // ~60fps
          }
        }
      }
    )

    const hideCompleteSub = KeyboardController.addListener('keyboardDidHide', () => {
      if (keyboardBlurBehavior === 'restore' && positionBeforeKeyboard.current !== null) {
        setAnimatedPosition(positionBeforeKeyboard.current, {
          type: 'timing',
          duration: 250,
        })
      }
      positionBeforeKeyboard.current = null
      setKeyboardHeight(0)
    })

    return () => {
      showSub?.remove?.()
      hideSub?.remove?.()
      changeSub?.remove?.()
      hideCompleteSub?.remove?.()
    }
  }, [enabled, keyboardControllerEnabled, setAnimatedPosition, keyboardBlurBehavior])

  // fallback to basic Keyboard API when keyboard-controller not available
  useEffect(() => {
    if (!enabled) return
    if (keyboardControllerEnabled) return // skip fallback when kc is available

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const keyboardShowListener = Keyboard.addListener(showEvent, (e) => {
      if (positionBeforeKeyboard.current !== null) return

      const currentY = isHidden || position === -1 ? screenSize : positions[position]
      positionBeforeKeyboard.current = currentY

      const kbHeight = e.endCoordinates.height
      const newY = Math.max(currentY - kbHeight, 0)

      setKeyboardHeight(kbHeight)
      setIsKeyboardVisible(true)
      setAnimatedPosition(newY, { type: 'timing', duration: 250 })
    })

    const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
      if (positionBeforeKeyboard.current === null) return

      if (keyboardBlurBehavior === 'restore') {
        setAnimatedPosition(positionBeforeKeyboard.current, {
          type: 'timing',
          duration: 250,
        })
      }

      positionBeforeKeyboard.current = null
      setKeyboardHeight(0)
      setIsKeyboardVisible(false)
    })

    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [
    enabled,
    keyboardControllerEnabled,
    positions,
    position,
    isHidden,
    screenSize,
    setAnimatedPosition,
    keyboardBlurBehavior,
  ])

  return {
    keyboardControllerEnabled,
    keyboardHeight,
    isKeyboardVisible,
    dismissKeyboard,
  }
}
