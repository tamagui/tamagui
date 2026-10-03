/**
 * Web event handling - maps RN-style events to DOM events
 */

import type { TamaguiComponentEvents } from './interfaces/TamaguiComponentEvents'

type EventKeys = keyof TamaguiComponentEvents
type EventLikeObject = { [key in EventKeys]?: any }

// a tap on a touch screen fires touchstart and touchend, then the browser's
// compatibility mousedown and mouseup for the same tap. press in and press out
// listen to both so a mouse presses too, so without this every press-in and
// press-out handler ran twice per tap (a toggle opened and closed again).
let lastTouch = -1e9

// a mouse event within a second of a touch is that compatibility echo
const pressFrom = (touch: boolean, handler?: (e: { timeStamp: number }) => void) =>
  handler &&
  ((e: { timeStamp: number }) => {
    if (touch) lastTouch = e.timeStamp
    else if (e.timeStamp - lastTouch < 1000) return
    handler(e)
  })

export function getWebEvents<E extends EventLikeObject>(events: E, webStyle = true) {
  return {
    onMouseEnter: events.onMouseEnter,
    onMouseLeave: events.onMouseLeave,
    [webStyle ? 'onClick' : 'onPress']: events.onPress,
    onMouseDown: pressFrom(false, events.onPressIn),
    onMouseUp: pressFrom(false, events.onPressOut),
    onTouchStart: pressFrom(true, events.onPressIn),
    onTouchEnd: pressFrom(true, events.onPressOut),
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
