/**
 * Web implementation of the keyboard controller sheet hook.
 *
 * Mobile browsers don't expose a keyboard API, but they do resize the
 * VisualViewport when the soft keyboard opens. We use the viewport shrink
 * (`clientHeight - visualViewport.height`) to detect the keyboard, then feed the
 * bottom layout inset (`clientHeight - (offsetTop + height)`) into
 * SheetImplementationCustom. The bottom inset accounts for iOS Safari panning
 * the visual viewport during focus, so the sheet doesn't over-lift.
 *
 * Without this, a bottom sheet on mobile web stays pinned behind the keyboard:
 * react-native-web's Dimensions tracks the (shrinking) VisualViewport, so any
 * content sized off window dimensions collapses while the sheet's bottom stays
 * occluded. See SheetImplementationCustom's activePositions / keyboardOccludedHeight.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { isWeb } from '@tamagui/constants'
import type {
  KeyboardControllerSheetOptions,
  KeyboardControllerSheetResult,
} from './types'
import {
  getWebKeyboardBottomInset,
  getWebKeyboardResizeHeight,
  isEditableElement,
  MIN_KEYBOARD_HEIGHT,
} from './webViewport'

export function useKeyboardControllerSheet(
  options: KeyboardControllerSheetOptions
): KeyboardControllerSheetResult {
  const { enabled } = options

  // initialize from the CURRENT viewport, not blindly from 0/false. when the
  // sheet opens with the soft keyboard already up (e.g. it was raised by a field
  // on the page behind, or by an autofocus whose keyboard wins the race against
  // the first layout), a false initial value makes the sheet's very first render
  // believe the keyboard is down — it captures a keyboard-free baseline from a
  // keyboard-shrunk layout and the anchor/seed machinery has to recover. reading
  // the viewport synchronously here removes that first-render race: the sheet
  // knows the keyboard is up on render 1 and takes the seed path deterministically.
  const [keyboardHeight, setKeyboardHeight] = useState(() =>
    isWeb && enabled && typeof window !== 'undefined' && window.visualViewport
      ? (() => {
          const resizeHeight = getWebKeyboardResizeHeight()
          return resizeHeight >= MIN_KEYBOARD_HEIGHT &&
            isEditableElement(document.activeElement)
            ? getWebKeyboardBottomInset()
            : 0
        })()
      : 0
  )
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(() => keyboardHeight > 0)

  // action-sheet pattern: pause keyboard hide events during drag so the sheet
  // position doesn't revert mid-gesture when a TextInput blurs.
  const pauseKeyboardHandler = useRef(false)
  const pendingHide = useRef(false)
  // live mirror of isKeyboardVisible so the listener can read it without
  // re-subscribing on every toggle.
  const isVisibleRef = useRef(false)
  isVisibleRef.current = isKeyboardVisible

  const dismissKeyboard = useCallback(() => {
    if (typeof document === 'undefined') return
    const active = document.activeElement as HTMLElement | null
    if (isEditableElement(active)) {
      active?.blur?.()
    }
  }, [])

  const flushPendingHide = useCallback(() => {
    if (pendingHide.current) {
      pendingHide.current = false
      setIsKeyboardVisible(false)
      setKeyboardHeight(0)
    }
  }, [])

  useEffect(() => {
    if (!isWeb || !enabled) return
    if (typeof window === 'undefined') return
    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      const resizeHeight = getWebKeyboardResizeHeight()
      const height = getWebKeyboardBottomInset()
      const tall = resizeHeight >= MIN_KEYBOARD_HEIGHT
      // require an editable element focused to *show* — this rules out URL-bar
      // collapse and other viewport changes that aren't a keyboard. but stay
      // visible while the viewport remains shrunk even if focus momentarily
      // moves to a non-editable element (e.g. tapping between two inputs fires
      // focusout→focusin), so the sheet doesn't flicker mid-transition.
      const editableFocused = isEditableElement(document.activeElement)
      const visible = tall && (editableFocused || isVisibleRef.current)

      if (!visible) {
        // suppress hide during an active drag so positions stay frozen; the
        // drag-end flush reconciles the real state.
        if (pauseKeyboardHandler.current && isVisibleRef.current) {
          pendingHide.current = true
          return
        }
        setIsKeyboardVisible(false)
        setKeyboardHeight(0)
        return
      }

      pendingHide.current = false
      setIsKeyboardVisible(true)
      setKeyboardHeight((prev) => (prev === height ? prev : height))
    }

    // resize tracks keyboard open/close. scroll tracks iOS Safari's focus pan:
    // visualViewport.offsetTop can change after the height has settled, and the
    // sheet cap must move in that same layout coordinate space.
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    // focus changes flip editable state without necessarily resizing the viewport
    window.addEventListener('focusin', update)
    window.addEventListener('focusout', update)

    update()

    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      window.removeEventListener('focusin', update)
      window.removeEventListener('focusout', update)
    }
  }, [enabled])

  return {
    keyboardControllerEnabled: false,
    keyboardHeight,
    isKeyboardVisible,
    dismissKeyboard,
    pauseKeyboardHandler,
    flushPendingHide,
  }
}
