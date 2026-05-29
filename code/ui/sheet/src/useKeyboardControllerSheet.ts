/**
 * Web implementation of the keyboard controller sheet hook.
 *
 * Mobile browsers don't expose a keyboard API, but they do resize the
 * VisualViewport when the soft keyboard opens. We derive the keyboard height as
 * `getStableLayoutViewportHeight() - visualViewport.height` (see webViewport —
 * the stable baseline is document.documentElement.clientHeight, NOT innerHeight,
 * which itself shrinks with the keyboard on real iOS Safari) and feed it into the
 * keyboardOccludedHeight scroll padding in SheetImplementationCustom.
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
  getWebKeyboardHeight,
  isEditableElement,
  MIN_KEYBOARD_HEIGHT,
} from './webViewport'

export function useKeyboardControllerSheet(
  options: KeyboardControllerSheetOptions
): KeyboardControllerSheetResult {
  const { enabled } = options

  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

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
      const height = getWebKeyboardHeight()
      const tall = height >= MIN_KEYBOARD_HEIGHT
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

    // only react to resize (keyboard height changes). we intentionally do NOT
    // listen to visualViewport 'scroll' — that fires continuously while the
    // sheet content scrolls and would re-derive the keyboard height from a
    // shifting viewport, making the sheet jump.
    vv.addEventListener('resize', update)
    // focus changes flip editable state without necessarily resizing the viewport
    window.addEventListener('focusin', update)
    window.addEventListener('focusout', update)

    update()

    return () => {
      vv.removeEventListener('resize', update)
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
