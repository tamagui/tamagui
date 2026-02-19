/**
 * Native event handling - uses RNGH when available, falls back to usePressability
 */

import { composeEventHandlers } from '@tamagui/helpers'
import { getGestureHandler } from '@tamagui/native'
import React, { useRef } from 'react'
import { useMainThreadPressEvents } from './helpers/mainThreadPressEvents'
import type { StaticConfig, TamaguiComponentStateRef } from './types'

// web events not used on native
export function getWebEvents() {
  return {}
}

export function useEvents(
  events: any,
  viewProps: any,
  stateRef: { current: TamaguiComponentStateRef },
  staticConfig: StaticConfig,
  isHOC?: boolean
) {
  // focus/blur events always attached directly
  if (events) {
    if (events.onFocus) {
      viewProps['onFocus'] = events.onFocus
    }
    if (events.onBlur) {
      viewProps['onBlur'] = events.onBlur
    }
  }

  const hasPressEvents =
    // its stable and always on if you have in/out/regular
    events?.onPress

  const gh = getGestureHandler()

  // track if we ever had press events to avoid re-parenting / hooks issues
  if (hasPressEvents) {
    stateRef.current.hasHadEvents = true
  }

  // avoid hooks/reparenting
  const everEnabled = Boolean(hasPressEvents || stateRef.current.hasHadEvents)
  const isUsingRNGH = gh.isEnabled

  // NOW handle early returns (after all hooks are called)
  // THESE BRANCHES ARE NEVER CHANGING RENDER-TO-RENDER

  // input special case - TextInput needs press events attached directly (not via RNGH)
  if (staticConfig.isInput) {
    if (events) {
      const { onPressIn, onPressOut, onPress } = events
      const inputEvents: any = {
        onPressIn,
        onPressOut: onPressOut || onPress,
      }
      if (onPressOut && onPress) {
        // only supports onPressIn and onPressOut so combine them
        inputEvents.onPressOut = composeEventHandlers(onPress, onPressOut)
      }
      Object.assign(viewProps, inputEvents)
    }

    // inputs don't use gesture handler
    return null
  }

  // HOC special case - pass press events to the inner component instead of wrapping
  // HOC components may return null which crashes GestureDetector (it tries to access
  // _internalInstanceHandle on a null native view). By passing events down, the inner
  // component handles gesture detection at its own level.
  if (isHOC) {
    if (events) {
      const { onPressIn, onPressOut, onPress, onLongPress, delayLongPress } = events
      Object.assign(viewProps, {
        onPressIn,
        onPressOut,
        onPress,
        onLongPress,
        delayLongPress,
      })
    }
    // HOCs don't use gesture handler at this level
    return null
  }

  // rngh path - logic (hooks already called above)
  if (isUsingRNGH) {
    // rngh path - hooks
    const callbacksRef = useRef<any>(isUsingRNGH ? {} : null)
    const gestureRef = useRef<any>(null)

    if (everEnabled) {
      // store callbacks in refs so gesture doesn't need to be recreated on every render
      callbacksRef.current = hasPressEvents
        ? {
            onPressIn: events.onPressIn,
            onPressOut: events.onPressOut,
            onPress: events.onPress,
            onLongPress: events.onLongPress,
          }
        : {}

      // only create gesture once, callbacks are read from ref
      if (!gestureRef.current) {
        gestureRef.current = gh.createPressGesture({
          onPressIn: (e: any) => callbacksRef.current.onPressIn?.(e),
          onPressOut: (e: any) => callbacksRef.current.onPressOut?.(e),
          onPress: (e: any) => callbacksRef.current.onPress?.(e),
          onLongPress: (e: any) => callbacksRef.current.onLongPress?.(e),
          delayLongPress: events?.delayLongPress,
          hitSlop: viewProps.hitSlop,
        })
      }
      // TODO update viewProps.hitSlop / events.delayLongPress!

      return gestureRef.current
    }

    return null
  }

  // fallback - use usePressability when RNGH not enabled
  // split into separate file to avoid deep import warnings
  useMainThreadPressEvents(events, viewProps, hasPressEvents)

  return null
}

export function wrapWithGestureDetector(
  content: any,
  gesture: any,
  stateRef: { current: TamaguiComponentStateRef },
  isHOC?: boolean
) {
  // Skip wrapping for HOC components - they may return null which crashes GestureDetector
  // (GestureDetector tries to access _internalInstanceHandle on a null native view)
  if (isHOC) {
    return content
  }

  const gh = getGestureHandler()
  const { GestureDetector, Gesture } = gh.state

  // avoid re-parenting: only wrap if we ever had press events
  const shouldWrap = stateRef.current.hasHadEvents

  if (!GestureDetector || !shouldWrap) {
    return content
  }

  // use actual gesture or no-op Manual gesture to maintain tree structure
  const gestureToUse = gesture || Gesture?.Manual()

  if (!gestureToUse) {
    return content
  }

  return React.createElement(GestureDetector, { gesture: gestureToUse }, content)
}
