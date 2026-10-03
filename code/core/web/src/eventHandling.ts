/**
 * Web event handling - maps RN-style events to DOM events
 */

import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents'

type EventKeys = keyof TamaguiComponentEvents
type EventLikeObject = { [key in EventKeys]?: any }

// a tap on a touch screen fires touchstart and touchend, then the browser's
// compatibility mousedown and mouseup for the same tap. press in and press out
// listen to both so a mouse presses too, so without this every press-in and
// press-out handler ran twice per tap (a toggle opened and closed again). a
// mouse event this soon after a touch is that compatibility echo.
const TOUCH_MOUSE_ECHO_MS = 1000
let lastTouchTimeStamp = Number.NEGATIVE_INFINITY

type TimedEvent = { timeStamp: number }

const fromTouch = (handler: ((e: TimedEvent) => void) | undefined) => (e: TimedEvent) => {
  lastTouchTimeStamp = e.timeStamp
  handler?.(e)
}

const fromMouse = (handler: ((e: TimedEvent) => void) | undefined) => (e: TimedEvent) => {
  if (e.timeStamp - lastTouchTimeStamp < TOUCH_MOUSE_ECHO_MS) return
  handler?.(e)
}

export function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
  const { onPressIn, onPressOut } = events
  return {
    onMouseEnter: events.onMouseEnter,
    onMouseLeave: events.onMouseLeave,
    [webStyle ? 'onClick' : 'onPress']: events.onPress,
    onMouseDown: onPressIn && fromMouse(onPressIn),
    onMouseUp: onPressOut && fromMouse(onPressOut),
    onTouchStart: onPressIn && fromTouch(onPressIn),
    onTouchEnd: onPressOut && fromTouch(onPressOut),
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
  _isCompositeComponent?: boolean,
  _hasRealPressEvents?: boolean
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
  _isInsideNativeMenu?: boolean,
  _debugName?: string | null,
  _hasRealPressEvents?: boolean
) {
  return null
}
