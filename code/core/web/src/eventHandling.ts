/**
 * Web event handling - maps RN-style events to DOM events
 */

import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents'

type EventKeys = keyof TamaguiComponentEvents
type EventLikeObject = { [key in EventKeys]?: any }

export function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
  return {
    onMouseEnter: events.onMouseEnter,
    onMouseLeave: events.onMouseLeave,
    [webStyle ? 'onClick' : 'onPress']: events.onPress,
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
  _isHOC?: boolean
) {
  return content
}

// no-op on web, events attached via getWebEvents
export function useEvents(
  _events: any,
  _viewProps: any,
  _stateRef: { current: any },
  _staticConfig: any,
  _isHOC?: boolean
) {
  return null
}
