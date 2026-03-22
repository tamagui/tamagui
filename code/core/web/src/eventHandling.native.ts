/**
 * Native event handling - uses RNGH when available, falls back to usePressability.
 * On TV platforms (Apple TV / Android TV), RNGH gestures are bypassed because TV
 * remote button presses don't go through the touch event system. Instead, the native
 * responder system (usePressability) handles all press events on TV.
 * TV focus navigation (onFocus/onBlur) is enabled by explicitly setting
 * focusable={true} (required by both tvOS and Android TV) and, for Android TV only,
 * collapsable={false} (prevents Android from flattening views out of the native
 * hierarchy). collapsable is intentionally NOT set on tvOS because it is an
 * Android-only prop at the native Fabric level — setting it on iOS/tvOS causes
 * the Fabric setter to be undefined, crashing with "TypeError: undefined is not
 * a function" at app launch.
 */

import { composeEventHandlers } from '@tamagui/helpers'
import { getGestureHandler } from '@tamagui/native'
import React, { useRef } from 'react'
import { Platform } from 'react-native'
import { useMainThreadPressEvents } from './helpers/mainThreadPressEvents'
import type { StaticConfig, TamaguiComponentStateRef } from './types'

// Responder handler keys that usePressability adds but are NOT in Android TV's
// Fabric codegen spec. Fabric calls setter.apply(node, [val]) for each prop, so
// an undefined setter → "TypeError: undefined is not a function" crash.
const androidTVFabricIncompatibleHandlers = [
  'onStartShouldSetResponder',
  'onMoveShouldSetResponder',
  'onStartShouldSetResponderCapture',
  'onMoveShouldSetResponderCapture',
  'onResponderGrant',
  'onResponderMove',
  'onResponderRelease',
  'onResponderTerminate',
  'onResponderTerminationRequest',
] as const

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
  isInsideNativeMenu?: boolean
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
  if (isHOC) {
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

    // On TV platforms, HOC viewProps are passed directly to the inner component.
    // Ensure the inner component receives the TV focus props so that d-pad
    // navigation can reach it even when the HOC exits before the TV block below.
    if (Platform.isTV && events) {
      if (viewProps.focusable === undefined) {
        viewProps.focusable = true
      }
      if (Platform.OS === 'android' && viewProps.collapsable === undefined) {
        viewProps.collapsable = false
      }
    }

    // HOCs don't use gesture handler at this level
    return null
  }

  // TV special case - RNGH doesn't handle TV remote presses; use usePressability instead.
  // Platform.isTV is stable (never changes), so it's safe to use as a hook branch guard.
  if (Platform.isTV) {
    // TV remote navigation requires focusable=true
    viewProps.focusable = true

    // collapsable=false is required by Android TV (Fabric) for focus to work, but
    // collapsable is NOT in the tvOS Fabric native spec — setting it there causes:
    // "TypeError: undefined is not a function" (setter.apply crash) at app launch.
    if (Platform.OS === 'android') {
      viewProps.collapsable = false
    }

    // usePressability handles all TV remote button presses
    useMainThreadPressEvents(events, viewProps, Boolean(hasPressEvents))

    // On Android TV with Fabric, usePressability adds responder handlers that are NOT
    // in the Android TV Fabric codegen spec. Each unrecognised prop causes Fabric to call
    // setter.apply(node, [val]) where setter is undefined → crash.
    if (Platform.OS === 'android') {
      for (const key of androidTVFabricIncompatibleHandlers) {
        delete viewProps[key]
      }
    }

    return null
  }

  // rngh path - logic (hooks already called above)
  // TV remote button presses (Apple TV / Android TV) do not go through RNGH's
  // gesture system. Fall back to usePressability (responder system) on TV so
  // that remote "select" button events reach the press handlers.
  if (isUsingRNGH && !Platform.isTV) {
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

  // fallback - use usePressability when RNGH not enabled, or on TV where RNGH
  // gestures do not respond to remote control "select" button events.
  // split into separate file to avoid deep import warnings
  useMainThreadPressEvents(events, viewProps, hasPressEvents)

  if (Platform.isTV && events) {
    // Make the component a participant in the TV focus navigation system.
    // On tvOS, a View without explicit focusable={true} is not part of the TV
    // focus engine (RNGH's gesture recognizer attachment was implicitly making
    // views focusable). On Android TV, focusable={true} is required so the
    // remote's directional pad can navigate to this element.
    if (viewProps.focusable === undefined) {
      viewProps.focusable = true
    }

    // Prevent Android TV from collapsing/flattening this View out of the native
    // view hierarchy. RNGH's GestureDetector previously forced collapsable={false}
    // via its Wrap component; without it the View can be flattened and will no
    // longer receive onFocus/onBlur events.
    // NOTE: collapsable is Android-only at the native Fabric level. Setting it on
    // tvOS (iOS) causes the Fabric prop-setter for 'collapsable' to be undefined,
    // which throws "TypeError: undefined is not a function" at app launch.
    if (Platform.OS === 'android' && viewProps.collapsable === undefined) {
      viewProps.collapsable = false
    }

    // Remove the legacy responder-system handlers that usePressability adds.
    //
    // On Android TV with the New Architecture (Fabric) these props do NOT have
    // native Fabric setters — the TV Fabric view only exposes the props declared
    // in TVViewConfig (onPressIn, onPressOut, onFocus, onBlur, onClick, focusable,
    // collapsable …). Passing any prop whose Fabric setter is absent causes the
    // renderer to call setter.apply(node, [val]) with an undefined function →
    // "TypeError: undefined is not a function" at app launch.
    //
    // TV remote button events are fully handled by tvPressEventHandlers
    // (onPressIn / onPressOut) and onClick, which ARE preserved, so removing
    // the responder handlers does not affect TV remote functionality.
    //
    // ⚠️  Backward-compatibility note (Old Architecture / non-Fabric):
    // In the legacy bridge architecture React's ResponderEventPlugin reads
    // handlers such as onStartShouldSetResponder directly from the component's
    // stored props (instanceProps). Deleting them here means touch-screen press
    // events will NOT work on Android TV devices running the Old Architecture.
    // TV remote presses are unaffected because they go through onPressIn /
    // onPressOut. Since the vast majority of Android TV devices have no touch
    // screen this is an acceptable trade-off, and migration to the New
    // Architecture (Fabric) is expected for all TV targets going forward.
    if (Platform.OS === 'android') {
      delete viewProps.onStartShouldSetResponder
      delete viewProps.onStartShouldSetResponderCapture
      delete viewProps.onMoveShouldSetResponder
      delete viewProps.onMoveShouldSetResponderCapture
      delete viewProps.onResponderGrant
      delete viewProps.onResponderReject
      delete viewProps.onResponderStart
      delete viewProps.onResponderEnd
      delete viewProps.onResponderMove
      delete viewProps.onResponderRelease
      delete viewProps.onResponderTerminate
      delete viewProps.onResponderTerminationRequest
      delete viewProps.onShouldBlockNativeResponder
    }

    // RN 0.84+ added TV-specific props (onPressEnter / onPressLeave) for the
    // remote select button. However these do NOT exist in the Fabric native spec
    // for Android TV views; setting them causes Fabric to call an undefined setter
    // via setter.apply() → "TypeError: undefined is not a function" at app launch.
    // The usePressability responder system above already handles TV remote presses
    // on all RN versions, so no additional mapping is needed here.
  }

  return null
}

export function wrapWithGestureDetector(
  content: any,
  gesture: any,
  stateRef: { current: TamaguiComponentStateRef },
  isHOC?: boolean
) {
  // Skip wrapping for HOC components - they may return null which crashes GestureDetector
  // (GestureDetector tries to access _internalInstanceHandle on a null native view)
  if (isHOC) {
    return content
  }

  // Skip RNGH wrapping on TV - RNGH's GestureDetector Wrap sets collapsable={false}
  // which is not in the tvOS Fabric native spec → "TypeError: undefined is not a function"
  // TV press events are handled by usePressability in the useEvents TV path instead.
  if (Platform.isTV) {
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

  return React.createElement(GestureDetector, { gesture: gestureToUse }, content)
}
