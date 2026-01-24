/**
 * Native event handling - uses RNGH when available, falls back to usePressability
 */

import React from 'react'
import { composeEventHandlers } from '@tamagui/helpers'
import { getGestureHandler } from '@tamagui/native'
import type { TamaguiComponentStateRef } from './types'

// web events not used on native
export function getWebEvents() {
  return {}
}

const dontComposePressabilityKeys: Record<string, boolean> = {
  onBlur: true,
  onFocus: true,
}

export function usePressHandling(
  events: any,
  viewProps: any,
  stateRef: { current: TamaguiComponentStateRef }
) {
  const hasPressEvents =
    events?.onPress || events?.onPressIn || events?.onPressOut || events?.onLongPress

  const gh = getGestureHandler()

  // track if we ever had press events to avoid re-parenting
  if (hasPressEvents) {
    stateRef.current.hasHadEvents = true
  }

  if (gh.isEnabled && hasPressEvents) {
    // RNGH path - return gesture for wrapping
    return gh.createPressGesture({
      onPressIn: events.onPressIn,
      onPressOut: events.onPressOut,
      onPress: events.onPress,
      onLongPress: events.onLongPress,
      delayLongPress: events.delayLongPress,
      hitSlop: viewProps.hitSlop,
    })
  }

  if (hasPressEvents) {
    // fallback - inline require usePressability only when needed
    const usePressability =
      require('react-native/Libraries/Pressability/usePressability').default
    const pressability = usePressability(events)

    if (pressability) {
      if (viewProps.hitSlop) {
        events.hitSlop = viewProps.hitSlop
      }
      for (const key in pressability) {
        const og = viewProps[key]
        const val = pressability[key]
        viewProps[key] =
          og && !dontComposePressabilityKeys[key] ? composeEventHandlers(og, val) : val
      }
    }
  }

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
