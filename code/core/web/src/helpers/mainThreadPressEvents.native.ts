/**
 * Fallback press handling when RNGH is not available.
 *
 * Implements the responder-based press detection that usePressability provides,
 * without the deep RN internal import. Supports pressIn/pressOut delays,
 * long press, cancellation, and min press duration.
 */

import { Platform } from 'react-native'
import { useRef } from 'react'

type PressState =
  | 'idle'
  | 'pressing' // responder granted, waiting for delay
  | 'active' // pressIn fired
  | 'longPressed' // long press detected

interface PressRef {
  state: PressState
  pressInTimer: ReturnType<typeof setTimeout> | null
  pressOutTimer: ReturnType<typeof setTimeout> | null
  longPressTimer: ReturnType<typeof setTimeout> | null
  activateTime: number
}

const DEFAULT_LONG_PRESS_DELAY = 500
const DEFAULT_MIN_PRESS_DURATION = 130

export function useMainThreadPressEvents(events: any, viewProps: any, enabled = true) {
  const ref = useRef<PressRef>(null as any)
  if (!ref.current) {
    ref.current = {
      state: 'idle',
      pressInTimer: null,
      pressOutTimer: null,
      longPressTimer: null,
      activateTime: 0,
    }
  }

  if (!enabled || !events) return

  const delayPressIn = Math.max(0, events.delayPressIn ?? 0)
  const delayPressOut = Math.max(0, events.delayPressOut ?? 0)
  const delayLongPress = Math.max(0, events.delayLongPress ?? DEFAULT_LONG_PRESS_DELAY)
  const minPressDuration = Math.max(
    0,
    events.minPressDuration ?? DEFAULT_MIN_PRESS_DURATION
  )

  function activate(e: any) {
    ref.current.state = 'active'
    ref.current.activateTime = Date.now()
    events.onPressIn?.(e)
  }

  function deactivate(e: any) {
    const pressDuration = Date.now() - ref.current.activateTime
    const remaining = Math.max(minPressDuration - pressDuration, delayPressOut)

    if (remaining > 0) {
      ref.current.pressOutTimer = setTimeout(() => {
        events.onPressOut?.(e)
      }, remaining)
    } else {
      events.onPressOut?.(e)
    }
  }

  function cleanup() {
    if (ref.current.pressInTimer) clearTimeout(ref.current.pressInTimer)
    if (ref.current.pressOutTimer) clearTimeout(ref.current.pressOutTimer)
    if (ref.current.longPressTimer) clearTimeout(ref.current.longPressTimer)
    ref.current.pressInTimer = null
    ref.current.pressOutTimer = null
    ref.current.longPressTimer = null
  }

  viewProps.onStartShouldSetResponder = () => !events.disabled

  viewProps.onResponderGrant = (e: any) => {
    cleanup()
    ref.current.state = 'pressing'

    if (delayPressIn > 0) {
      ref.current.pressInTimer = setTimeout(() => activate(e), delayPressIn)
    } else {
      activate(e)
    }

    if (events.onLongPress) {
      ref.current.longPressTimer = setTimeout(() => {
        if (ref.current.state === 'active') {
          ref.current.state = 'longPressed'
          events.onLongPress?.(e)
        }
      }, delayLongPress + delayPressIn)
    }
  }

  viewProps.onResponderRelease = (e: any) => {
    const wasActive = ref.current.state === 'active'
    const wasLongPressed = ref.current.state === 'longPressed'
    cleanup()

    // if pressIn hasn't fired yet (was in delay), fire it now then immediately deactivate
    if (ref.current.state === 'pressing') {
      activate(e)
    }

    if (!wasLongPressed) {
      events.onPress?.(e)
    }

    deactivate(e)
    ref.current.state = 'idle'
  }

  viewProps.onResponderTerminate = (e: any) => {
    cleanup()
    if (ref.current.state === 'active' || ref.current.state === 'longPressed') {
      deactivate(e)
    }
    ref.current.state = 'idle'
  }

  viewProps.onResponderTerminationRequest = () => {
    return events.cancelable !== false
  }

  viewProps.onResponderMove = (e: any) => {
    events.onPressMove?.(e)
  }

  // On TV (Android TV / tvOS) the remote "select" button bypasses the touch
  // responder chain entirely and fires directly on the focused view.
  // On Android TV Fabric the select-button action is exposed as `onClick`
  // (not `onPress`) in the TVViewConfig codegen spec. `onPress` is not a
  // recognised Fabric setter on Android TV views, so it silently does nothing.
  // On tvOS (iOS) the responder `onPress` prop is fine.
  if (Platform.isTV) {
    viewProps.onPressIn = events.onPressIn
    viewProps.onPressOut = events.onPressOut
    if (Platform.OS === 'android') {
      // Android TV Fabric: map press/longPress → onClick/onLongClick so the
      // remote select button fires them. `onPress` and `onLongPress` are not
      // recognised Fabric setters in the Android TV TVViewConfig spec.
      viewProps.onClick = events.onPress
      viewProps.onLongClick = events.onLongPress
    } else {
      viewProps.onPress = events.onPress
      viewProps.onLongPress = events.onLongPress
    }
  }
}
