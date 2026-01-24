/**
 * Native event handling using RN's usePressability
 * RNGH infrastructure is in place for future use (sheet gestures, etc.)
 */

import { composeEventHandlers } from '@tamagui/helpers'

// RN's pressability for press handling
const usePressability =
  require('react-native/Libraries/Pressability/usePressability').default

// web events not used on native
export function getWebEvents() {
  return {}
}

// keys that should not be composed with existing handlers
const dontComposePressabilityKeys: Record<string, boolean> = {
  onBlur: true,
  onFocus: true,
}

export function usePressHandling(
  events: any,
  viewProps: any,
  _stateRef: { current: any }
) {
  const hasPressEvents =
    events?.onPress || events?.onPressIn || events?.onPressOut || events?.onLongPress

  // use usePressability for press handling
  // handles all press scenarios including drag-off correctly
  const pressability = usePressability(events)

  if (hasPressEvents && pressability) {
    if (events && viewProps.hitSlop) {
      events.hitSlop = viewProps.hitSlop
    }
    for (const key in pressability) {
      const og = viewProps[key]
      const val = pressability[key]
      viewProps[key] =
        og && !dontComposePressabilityKeys[key] ? composeEventHandlers(og, val) : val
    }
  }

  // return null - no gesture wrapping needed for press handling
  return null
}

// no-op for press handling - gesture wrapping not used
export function wrapWithGestureDetector(
  content: any,
  _gesture: any,
  _stateRef: { current: any }
) {
  return content
}
