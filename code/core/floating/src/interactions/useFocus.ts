import { useEffect, useMemo, useRef } from 'react'

import type {
  ElementProps,
  FloatingInteractionContext,
  OpenChangeReason,
  UseFocusProps,
} from './types'
import {
  activeElement,
  clearTimeoutIfSet,
  contains,
  getDocument,
  getTarget,
  isElement,
  isHTMLElement,
  isMac,
  isSafari,
  isTypeableElement,
  matchesFocusVisible,
} from './utils'

function isMacSafari() {
  return isMac() && isSafari()
}

// focus interaction: opens on focus, closes on blur.
// ported from floating-ui/react useFocus hook with adaptations for our context.
export function useFocus(
  context: FloatingInteractionContext,
  props: UseFocusProps = {}
): ElementProps {
  const { open, onOpenChange, events, dataRef, elements } = context
  const { enabled = true, visibleOnly = true } = props

  const blockFocusRef = useRef(false)
  const timeoutRef = useRef(-1)
  const keyboardModalityRef = useRef(true)

  // if the reference was focused and the user left the tab/window, and the
  // floating element was not open, block focus when they return.
  // also tracks keyboard vs pointer modality on mac safari.
  useEffect(() => {
    if (!enabled) return

    const win = getDocument(elements.domReference).defaultView || window

    function onBlur() {
      if (
        !open &&
        isHTMLElement(elements.domReference) &&
        elements.domReference === activeElement(getDocument(elements.domReference))
      ) {
        blockFocusRef.current = true
      }
    }

    function onKeyDown() {
      keyboardModalityRef.current = true
    }

    function onPointerDown() {
      keyboardModalityRef.current = false
    }

    win.addEventListener('blur', onBlur)

    if (isMacSafari()) {
      win.addEventListener('keydown', onKeyDown, true)
      win.addEventListener('pointerdown', onPointerDown, true)
    }

    return () => {
      win.removeEventListener('blur', onBlur)

      if (isMacSafari()) {
        win.removeEventListener('keydown', onKeyDown, true)
        win.removeEventListener('pointerdown', onPointerDown, true)
      }
    }
  }, [elements.domReference, open, enabled])

  // block focus after reference-press or escape-key close,
  // so that focus returning to the trigger doesn't reopen
  useEffect(() => {
    if (!enabled) return
    if (!events) return

    function handleOpenChange({ reason }: { reason: OpenChangeReason }) {
      if (reason === 'reference-press' || reason === 'escape-key') {
        blockFocusRef.current = true
      }
    }

    events.on('openchange', handleOpenChange)
    return () => {
      events.off('openchange', handleOpenChange)
    }
  }, [events, enabled])

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeoutIfSet(timeoutRef)
    }
  }, [])

  const reference: ElementProps['reference'] = useMemo(
    () => ({
      onMouseLeave() {
        blockFocusRef.current = false
      },
      onFocus(event: any) {
        if (blockFocusRef.current) return

        const target = getTarget(event.nativeEvent)

        if (visibleOnly && isElement(target)) {
          // safari fails to match :focus-visible if focus was initially
          // outside the document
          if (isMacSafari() && !event.relatedTarget) {
            if (!keyboardModalityRef.current && !isTypeableElement(target)) {
              return
            }
          } else if (!matchesFocusVisible(target)) {
            return
          }
        }

        onOpenChange(true, event.nativeEvent, 'focus')
      },
      onBlur(event: any) {
        blockFocusRef.current = false
        const relatedTarget = event.relatedTarget as Element | null
        const nativeEvent = event.nativeEvent

        // wait for the window blur listener to fire
        timeoutRef.current = window.setTimeout(() => {
          const activeEl = activeElement(
            elements.domReference ? elements.domReference.ownerDocument : document
          )

          // focus left the page, keep it open
          if (!relatedTarget && activeEl === elements.domReference) return

          // when focusing the reference element then clicking into the floating
          // element, prevent it from hiding. we check activeElement rather than
          // relatedTarget to handle shadow DOM correctly.
          if (
            contains(context.refs.floating.current, activeEl) ||
            contains(elements.domReference, activeEl)
          ) {
            return
          }

          onOpenChange(false, nativeEvent, 'focus')
        })
      },
    }),
    [context.refs.floating, elements.domReference, onOpenChange, visibleOnly]
  )

  return useMemo(() => (enabled ? { reference } : {}), [enabled, reference])
}
