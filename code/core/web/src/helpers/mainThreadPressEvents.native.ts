import { unstable_hasExternalPressOwnership } from '@tamagui/native'
import { useRef } from 'react'
import type { GestureResponderEvent } from 'react-native'
import type usePressabilityType from 'react-native/Libraries/Pressability/usePressability'

export function useMainThreadPressEvents(
  events: any,
  viewProps: any,
  enabled = true,
  debugName?: string | null
) {
  // static config evaluation does not render; load native code at render time.
  const usePressability: typeof usePressabilityType =
    require('react-native/Libraries/Pressability/usePressability').default
  const initialized = useRef(false)
  const ownsResponder = useRef(false)
  const pressActive = useRef(false)
  const active = enabled && Boolean(events)
  if (active) initialized.current = true

  function endPress(e: GestureResponderEvent) {
    if (!pressActive.current) return
    pressActive.current = false
    events?.onPressOut?.(e)
  }

  // react native owns press geometry, timing and cancellation; initialize only
  // for pressable components and remove callbacks when the responder path stops.
  const handlers = usePressability(
    initialized.current
      ? {
          ...(active ? events : {}),
          disabled: !active || events?.disabled,
          android_disableSound: true,
          onPressIn: active
            ? (e: GestureResponderEvent) => {
                endPress(e)
                pressActive.current = true
                events.onPressIn?.(e)
              }
            : undefined,
          onPressOut: active ? endPress : undefined,
          hitSlop: viewProps.hitSlop,
          pressRectOffset: viewProps.pressRetentionOffset,
        }
      : null
  )
  if (!active || !handlers) return

  const userStartShouldSet = viewProps.onStartShouldSetResponder
  const userGrant = viewProps.onResponderGrant
  const userRelease = viewProps.onResponderRelease
  const userTerminate = viewProps.onResponderTerminate
  const userTerminationRequest = viewProps.onResponderTerminationRequest
  const userMove = viewProps.onResponderMove
  const userClick = viewProps.onClick

  viewProps.onStartShouldSetResponder = (e: GestureResponderEvent) =>
    userStartShouldSet?.(e) ||
    (!unstable_hasExternalPressOwnership() && handlers.onStartShouldSetResponder())

  viewProps.onResponderGrant = (e: GestureResponderEvent) => {
    endPress(e)
    if (unstable_hasExternalPressOwnership()) return
    userGrant?.(e)
    ownsResponder.current = true
    return handlers.onResponderGrant(e)
  }

  viewProps.onResponderRelease = (e: GestureResponderEvent) => {
    if (!ownsResponder.current) return
    ownsResponder.current = false
    if (unstable_hasExternalPressOwnership()) {
      handlers.onResponderTerminate(e)
      endPress(e)
      return
    }
    userRelease?.(e)
    handlers.onResponderRelease(e)
  }

  viewProps.onResponderTerminate = (e: GestureResponderEvent) => {
    userTerminate?.(e)
    if (ownsResponder.current) handlers.onResponderTerminate(e)
    endPress(e)
    ownsResponder.current = false
  }

  viewProps.onResponderTerminationRequest = (e: GestureResponderEvent) =>
    userTerminationRequest?.(e) ?? handlers.onResponderTerminationRequest()

  viewProps.onResponderMove = (e: GestureResponderEvent) => {
    userMove?.(e)
    if (ownsResponder.current) handlers.onResponderMove(e)
  }

  viewProps.onClick = (e: GestureResponderEvent) => {
    userClick?.(e)
    if (!unstable_hasExternalPressOwnership()) handlers.onClick(e)
  }
}
