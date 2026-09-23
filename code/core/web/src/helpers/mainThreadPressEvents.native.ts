/**
 * Fallback press handling when RNGH is not available.
 *
 * Implements the responder-based press detection that usePressability provides,
 * without the deep RN internal import. Supports pressIn/pressOut delays,
 * long press, cancellation, and min press duration.
 */

import { unstable_hasExternalPressOwnership } from '@tamagui/native'
import { useEffect, useRef } from 'react'

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
  blockedByExternalOwnership: boolean
  // true from the instant onPressIn fires until exactly one onPressOut fires.
  // A press clause is driven by this pair, so if they ever fall out of sync the
  // component stays latched in its press look with no event left to clear it.
  // Every responder exit path (release, terminate, a grant refused for external
  // ownership) therefore routes through releasePressOut exactly once.
  pressInOutstanding: boolean
}

const DEFAULT_LONG_PRESS_DELAY = 500
const DEFAULT_MIN_PRESS_DURATION = 130

export function useMainThreadPressEvents(
  events: any,
  viewProps: any,
  enabled = true,
  debugName?: string | null
) {
  const ref = useRef<PressRef>(null as any)
  if (!ref.current) {
    ref.current = {
      state: 'idle',
      pressInTimer: null,
      pressOutTimer: null,
      longPressTimer: null,
      activateTime: 0,
      blockedByExternalOwnership: false,
      pressInOutstanding: false,
    }
  }

  // caller handlers may hold a press open across unmount (a delayed pressOut
  // timer): drop the timers so nothing fires into an unmounted component. The
  // press look dies with the view, so no onPressOut is owed here.
  useEffect(() => {
    return () => {
      clearStartTimers()
      if (ref.current.pressOutTimer) {
        clearTimeout(ref.current.pressOutTimer)
        ref.current.pressOutTimer = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!enabled || !events) return

  const delayPressIn = Math.max(0, events.delayPressIn ?? 0)
  const delayPressOut = Math.max(0, events.delayPressOut ?? 0)
  const delayLongPress = Math.max(0, events.delayLongPress ?? DEFAULT_LONG_PRESS_DELAY)
  const minPressDuration = Math.max(
    0,
    events.minPressDuration ?? DEFAULT_MIN_PRESS_DURATION
  )

  function activate(e: any) {
    if (ref.current.pressInOutstanding) return
    ref.current.pressInOutstanding = true
    ref.current.state = 'active'
    ref.current.activateTime = Date.now()
    events.onPressIn?.(e)
  }

  // clear the timers that could still *start* a press. A pending pressOut is a
  // press that already started, so it is never cancelled here — it is either
  // awaited or flushed by releasePressOut.
  function clearStartTimers() {
    if (ref.current.pressInTimer) clearTimeout(ref.current.pressInTimer)
    if (ref.current.longPressTimer) clearTimeout(ref.current.longPressTimer)
    ref.current.pressInTimer = null
    ref.current.longPressTimer = null
  }

  // the single exit that guarantees pressIn has a matching pressOut.
  function releasePressOut(e: any) {
    if (ref.current.pressOutTimer) {
      clearTimeout(ref.current.pressOutTimer)
      ref.current.pressOutTimer = null
    }
    if (!ref.current.pressInOutstanding) return
    ref.current.pressInOutstanding = false
    ref.current.state = 'idle'
    events.onPressOut?.(e)
  }

  function deactivate(e: any) {
    if (!ref.current.pressInOutstanding) return
    const pressDuration = Date.now() - ref.current.activateTime
    const remaining = Math.max(minPressDuration - pressDuration, delayPressOut)

    if (remaining > 0) {
      if (!ref.current.pressOutTimer) {
        ref.current.pressOutTimer = setTimeout(() => {
          ref.current.pressOutTimer = null
          releasePressOut(e)
        }, remaining)
      }
    } else {
      releasePressOut(e)
    }
  }

  function resetPress(e: any) {
    releasePressOut(e)
    clearStartTimers()
    ref.current.blockedByExternalOwnership = false
  }

  // user-supplied responder props (the View's raw RN gesture API) must keep
  // working: blindly overwriting them here silently killed any press-hold-drag
  // gesture built on onResponderMove/onResponderRelease whenever the element
  // also had hover/press events. compose instead — user handler first, then
  // the press synthesis.
  const userStartShouldSet = viewProps.onStartShouldSetResponder
  const userGrant = viewProps.onResponderGrant
  const userRelease = viewProps.onResponderRelease
  const userTerminate = viewProps.onResponderTerminate
  const userTerminationRequest = viewProps.onResponderTerminationRequest
  const userMove = viewProps.onResponderMove

  viewProps.onStartShouldSetResponder = (e: any) => {
    if (userStartShouldSet?.(e)) return true
    return !events.disabled && !unstable_hasExternalPressOwnership()
  }

  viewProps.onResponderGrant = (e: any) => {
    // a new grant always ends any prior press first: its pressOut may still be
    // sitting in the min-duration timer, and clearing that timer without
    // firing it is how the previous press latches.
    releasePressOut(e)
    clearStartTimers()

    if (unstable_hasExternalPressOwnership()) {
      ref.current.state = 'idle'
      ref.current.blockedByExternalOwnership = true
      return
    }

    userGrant?.(e)
    ref.current.blockedByExternalOwnership = false
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
    // external ownership can be claimed *after* this press already started
    // (a native menu boundary, auto-expiring). The release still owes a
    // pressOut, or the press look stays latched.
    if (ref.current.blockedByExternalOwnership || unstable_hasExternalPressOwnership()) {
      resetPress(e)
      return
    }

    userRelease?.(e)
    const wasLongPressed = ref.current.state === 'longPressed'
    clearStartTimers()

    // if pressIn hasn't fired yet (was in delay), fire it now then deactivate
    if (ref.current.state === 'pressing') {
      activate(e)
    }

    if (!wasLongPressed) {
      events.onPress?.(e)
    }

    deactivate(e)
    ref.current.blockedByExternalOwnership = false
  }

  viewProps.onResponderTerminate = (e: any) => {
    userTerminate?.(e)
    resetPress(e)
  }

  viewProps.onResponderTerminationRequest = (e: any) => {
    if (userTerminationRequest) return userTerminationRequest(e)
    return events.cancelable !== false
  }

  viewProps.onResponderMove = (e: any) => {
    userMove?.(e)
    events.onPressMove?.(e)
  }
}
