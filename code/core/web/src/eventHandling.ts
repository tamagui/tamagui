/**
 * Web event handling - maps RN-style events to DOM events
 */

import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents'

type EventKeys = keyof TamaguiComponentEvents
type EventLikeObject = { [key in EventKeys]?: any }

export function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
  // wrap onPress to stopPropagation - matches RN Pressable semantics where
  // only innermost pressable fires. use onClick directly for bubbling behavior.
  const onPressHandler = events.onPress
    ? (e: any) => {
        e.stopPropagation()
        events.onPress!(e)
      }
    : undefined

  return {
    onMouseEnter: events.onMouseEnter,
    onMouseLeave: events.onMouseLeave,
    [webStyle ? 'onClick' : 'onPress']: onPressHandler,
    onMouseDown: events.onPressIn,
    onMouseUp: events.onPressOut,
    onTouchStart: events.onPressIn,
    onTouchEnd: events.onPressOut,
    onFocus: events.onFocus,
    onBlur: events.onBlur,
  }
}

// web doesn't need wrapping - events go directly on element
export function wrapWithGestureDetector(
  content: any,
  _gesture: any,
  _stateRef: { current: any },
  _isHOC?: boolean,
  _isCompositeComponent?: boolean
) {
  return content
}

// no-op on web, events attached via getWebEvents
export function useEvents(
  _events: any,
  _viewProps: any,
  _stateRef: { current: any },
  _staticConfig: any,
  _isHOC?: boolean,
  _isInsideNativeMenu?: boolean
) {
  return null
}
