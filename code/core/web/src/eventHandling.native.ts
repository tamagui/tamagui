/**
 * Native event handling - uses RNGH when available, falls back to usePressability
 */

import { composeEventHandlers } from '@tamagui/helpers'
import { getGestureHandler } from '@tamagui/native'
import React, { useRef } from 'react'
import type { StaticConfig, TamaguiComponentStateRef } from './types'

// web events not used on native
export function getWebEvents() {
  return {}
}

export function useEvents(
  events: any,
  viewProps: any,
  stateRef: { current: TamaguiComponentStateRef },
  staticConfig: StaticConfig
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

  // input special case - TextInput needs press events attached directly (not via RNGH)
  if (staticConfig.isInput && events) {
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
    // inputs don't use gesture handler
    return null
  }

  const hasPressEvents =
    // its stable and always on if you have in/out/regular
    events?.onPress

  const gh = getGestureHandler()

  // track if we ever had press events to avoid re-parenting / hooks issues
  if (hasPressEvents) {
    stateRef.current.hasHadEvents = true
  }

  const pressEventsEnabled = gh.isEnabled && hasPressEvents

  if (stateRef.current.hasHadEvents || pressEventsEnabled) {
    // RNGH path - return gesture for wrapping
    // store callbacks in refs so gesture doesn't need to be recreated on every render
    const callbacksRef = useRef<any>({})
    callbacksRef.current = pressEventsEnabled
      ? {
          onPressIn: events.onPressIn,
          onPressOut: events.onPressOut,
          onPress: events.onPress,
          onLongPress: events.onLongPress,
        }
      : {}

    // only create gesture once, callbacks are read from ref
    const gestureRef = useRef<any>(null)
    if (!gestureRef.current) {
      gestureRef.current = gh.createPressGesture({
        onPressIn: (e: any) => callbacksRef.current.onPressIn?.(e),
        onPressOut: (e: any) => callbacksRef.current.onPressOut?.(e),
        onPress: (e: any) => callbacksRef.current.onPress?.(e),
        onLongPress: (e: any) => callbacksRef.current.onLongPress?.(e),
        delayLongPress: events.delayLongPress,
        hitSlop: viewProps.hitSlop,
      })
    }
    return gestureRef.current
  }

  // fallback - use usePressability when RNGH not enabled
  // split into separate file to avoid deep import warnings
  const { useMainThreadPressEvents } = require('./helpers/mainThreadPressEvents')
  useMainThreadPressEvents(events, viewProps, hasPressEvents)

  return null
}

export function wrapWithGestureDetector(
  content: any,
  gesture: any,
  stateRef: { current: TamaguiComponentStateRef }
) {
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
