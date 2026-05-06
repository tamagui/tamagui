/**
 * Native event handling - uses RNGH when available, falls back to responder system
 */

import { composeEventHandlers } from '@tamagui/helpers'
import { getGestureHandler } from '@tamagui/native'
import React, { useRef } from 'react'
import { View } from 'react-native'
import { useMainThreadPressEvents } from './helpers/mainThreadPressEvents'
import type { StaticConfig, TamaguiComponentStateRef } from './types'

// Fabric uses nativeFabricUIManager.setIsJSResponder directly, bypassing
// RNGH's UIManager.setJSResponder monkey-patch (createHandler.tsx:99). So on
// Fabric the freeze-on-many-mounts coordination conflict that drove
// c345b5fc28 (claim hoisted to a wrapper) does not apply, and we can attach
// the responder claim directly to the gesture target.
const isFabric = !!(globalThis as any).nativeFabricUIManager

const responderClaim = () => true
const responderDeny = () => false
const responderWrapperStyle = { display: 'contents' } as const

// web events not used on native
export function getWebEvents() {
  return {}
}

export function useEvents(
  events: any,
  viewProps: any,
  stateRef: { current: TamaguiComponentStateRef },
  staticConfig: StaticConfig,
  isHOC?: boolean,
  isInsideNativeMenu?: boolean,
  debugName?: string | null
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

  const hasPressEvents =
    // its stable and always on if you have in/out/regular
    events?.onPress
  const hasAnyPressCallbacks = Boolean(
    events?.onPress || events?.onPressIn || events?.onPressOut || events?.onLongPress
  )

  const gh = getGestureHandler()

  // track if we ever had press events to avoid re-parenting / hooks issues
  if (hasPressEvents) {
    stateRef.current.hasHadEvents = true
  }

  // avoid hooks/reparenting
  const everEnabled = Boolean(hasPressEvents || stateRef.current.hasHadEvents)
  const isUsingRNGH = gh.isEnabled

  // NOW handle early returns (after all hooks are called)
  // THESE BRANCHES ARE NEVER CHANGING RENDER-TO-RENDER

  // input special case - TextInput needs press events attached directly (not via RNGH)
  if (staticConfig.isInput) {
    if (events) {
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
    }

    // inputs don't use gesture handler
    return null
  }

  // HOC special case - pass press events to the inner component instead of wrapping
  // HOC components may return null which crashes GestureDetector (it tries to access
  // _internalInstanceHandle on a null native view). By passing events down, the inner
  // component handles gesture detection at its own level.
  //
  // Composite component special case - when styled() wraps a non-Tamagui component
  // (e.g. React.forwardRef), the elementType becomes that composite component.
  // GestureDetector/responder wrapping around a composite component breaks during
  // re-renders triggered by pressStyle state changes (the gesture/responder loses
  // attachment to the native view through the composite layers). Pass events as props
  // so they flow through to the inner native View.
  const isCompositeComponent =
    !isHOC && staticConfig.Component && typeof staticConfig.Component !== 'string'

  if (isHOC || isCompositeComponent) {
    if (events) {
      const { onPressIn, onPressOut, onPress, onLongPress, delayLongPress } = events
      Object.assign(viewProps, {
        onPressIn,
        onPressOut,
        onPress,
        onLongPress,
        delayLongPress,
      })
    }
    // HOCs and composite components don't use gesture handler at this level
    return null
  }

  // rngh path - logic (hooks already called above)
  if (isUsingRNGH) {
    // rngh path - hooks
    const callbacksRef = useRef<any>(isUsingRNGH ? {} : null)
    const gestureRef = useRef<any>(null)

    if (everEnabled) {
      // store callbacks in refs so gesture doesn't need to be recreated on every render
      callbacksRef.current = hasPressEvents
        ? {
            onPressIn: events.onPressIn,
            onPressOut: events.onPressOut,
            onPress: events.onPress,
            onLongPress: events.onLongPress,
          }
        : {}

      // only create gesture once, callbacks are read from ref
      if (!gestureRef.current) {
        if (isInsideNativeMenu) {
          // Inside native menus on Android: use Manual gesture with manualActivation
          // so it never goes ACTIVE (which would send ACTION_CANCEL to MenuView).
          // Press callbacks fire via onTouchesDown/Up instead.
          const { Gesture } = gh.state
          const manual = Gesture.Manual()
            .runOnJS(true)
            .manualActivation(true)
            .onTouchesDown(() => {
              callbacksRef.current.onPressIn?.({})
            })
            .onTouchesUp(() => {
              callbacksRef.current.onPress?.({})
              callbacksRef.current.onPressOut?.({})
            })
            .onTouchesCancelled(() => {
              callbacksRef.current.onPressOut?.({})
            })
          gestureRef.current = manual
        } else {
          gestureRef.current = gh.createPressGesture({
            debugName,
            onPressIn: (e: any) => callbacksRef.current.onPressIn?.(e),
            onPressOut: (e: any) => callbacksRef.current.onPressOut?.(e),
            onPress: (e: any) => callbacksRef.current.onPress?.(e),
            onLongPress: (e: any) => callbacksRef.current.onLongPress?.(e),
            delayLongPress: events?.delayLongPress,
            hitSlop: viewProps.hitSlop,
          })
        }
      }
      // TODO update viewProps.hitSlop / events.delayLongPress!

      return gestureRef.current
    }

    return null
  }

  useMainThreadPressEvents(events, viewProps, hasPressEvents, debugName)

  return null
}

export function wrapWithGestureDetector(
  content: any,
  gesture: any,
  stateRef: { current: TamaguiComponentStateRef },
  isHOC?: boolean,
  isCompositeComponent?: boolean
) {
  // Skip wrapping for HOC and composite components - they pass press events
  // to the inner component via props instead of using GestureDetector
  if (isHOC || isCompositeComponent) {
    return content
  }

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

  if (isFabric) {
    // attach responder claim directly to the gesture target. on Fabric this
    // does not conflict with RNGH because the responder path goes through
    // nativeFabricUIManager.setIsJSResponder, not UIManager.setJSResponder
    // (which RNGH intercepts on Paper). avoids a wrapper view, so layout
    // is unchanged and we don't trip Fabric's display:contents -> ForceFlattenView.
    const claimed = React.cloneElement(content, {
      onStartShouldSetResponder: responderClaim,
      onResponderTerminationRequest: responderDeny,
    })
    return React.createElement(GestureDetector, { gesture: gestureToUse }, claimed)
  }

  // Paper: keep the hoisted display:contents wrapper. claiming on the gesture
  // target itself triggers RNGH's setJSResponder coordination conflict and
  // freezes long lists (c345b5fc28).
  return React.createElement(
    View,
    {
      collapsable: false,
      style: responderWrapperStyle,
      onStartShouldSetResponder: responderClaim,
      onResponderTerminationRequest: responderDeny,
    },
    React.createElement(GestureDetector, { gesture: gestureToUse }, content)
  )
}
