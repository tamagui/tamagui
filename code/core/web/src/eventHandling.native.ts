/**
 * Native event handling - uses RNGH when available, falls back to responder system
 */

import { composeEventHandlers } from '@tamagui/helpers'
import { getGestureHandler } from '@tamagui/native'
import React, { useRef } from 'react'
import { Platform, View } from 'react-native'
import { useMainThreadPressEvents } from './helpers/mainThreadPressEvents'
import type { StaticConfig, TamaguiComponentStateRef } from './types'

const isFabric = !!(globalThis as any).nativeFabricUIManager

// Android (new arch + RNGH 2.30) freezes the JS thread when many pressStyle
// components each attach a Gesture.Manual()...onTouchesDown observer (e.g. a
// sheet with several buttons / inputs). Each handler opts into RNGH's
// pointer-data pipeline (needsPointerData), and the combined coordination
// cost recreates the same setJSResponder freeze c345b5fc28 was supposed to
// have killed. iOS Fabric absorbs the cost; Android Fabric doesn't.
// Skip the observer + wrap on Android — pressStyle visuals fall through to
// the standard responder path via the synthesized event handlers.
// computed lazily: the native core bundle is also loaded by the compiler for
// static extraction, where Platform's init runs after this module's. A
// top-level read of Platform.OS sees Platform === undefined and crashes the
// loader. Reading on first call defers until after all module inits complete.
let isAndroidCache: boolean | undefined
const getIsAndroid = () => {
  if (isAndroidCache === undefined) {
    isAndroidCache = Platform?.OS === 'android'
  }
  return isAndroidCache
}

let isNativeDesktopCache: boolean | undefined
const getIsNativeDesktop = () => {
  if (isNativeDesktopCache === undefined) {
    isNativeDesktopCache = Platform?.OS === 'macos' || Platform?.OS === 'windows'
  }
  return isNativeDesktopCache
}

const responderClaim = () => true
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
  debugName?: string | null,
  hasRealPressEvents?: boolean
) {
  // focus/blur events always attached directly
  if (events) {
    if (events.onFocus) {
      viewProps['onFocus'] = events.onFocus
    }
    if (events.onBlur) {
      viewProps['onBlur'] = events.onBlur
    }
    if (getIsNativeDesktop()) {
      if (events.onMouseEnter) {
        viewProps['onMouseEnter'] = events.onMouseEnter
      }
      if (events.onMouseLeave) {
        viewProps['onMouseLeave'] = events.onMouseLeave
      }
    }
  }

  // hasPressEvents includes events.onPress synthesized just for pressStyle
  // visuals; hasRealPressEvents is true only when the caller passed a real
  // handler. the distinction matters for arbitration: pressStyle-only gestures
  // must not steal ownership from a real-handler ancestor (e.g. Link asChild's
  // navigate handler merged onto a child View by Slot).
  const hasPressEvents = events?.onPress

  const gh = getGestureHandler()

  // track whether this component has ever had press events to keep hooks
  // ordering stable across renders (gesture is created once per mount).
  if (hasPressEvents) {
    stateRef.current.hasHadEvents = true
  }
  if (hasRealPressEvents) {
    stateRef.current.hasRealPressEvents = true
  }

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

    // Real press handlers use the responder system for delivery even when RNGH
    // is configured. RNGH Tap begin/end ordering is not stable enough for
    // nested Tamagui press arbitration, and Fabric can mount a stale Tap that
    // claims responder but never finalizes. The responder path is the source of
    // truth RN already uses for innermost press ownership.
    //
    // Android pressStyle-only fallback: wire synthesized press handlers to the
    // responder system on viewProps instead of an RNGH Manual observer (which
    // freezes Android — see top-of-file isAndroid comment). Hook is called
    // unconditionally here for stable hooks order; useMainThreadPressEvents
    // no-ops when enabled is false.
    const useResponderFallback =
      !isInsideNativeMenu &&
      Boolean(hasRealPressEvents || (getIsAndroid() && hasPressEvents))
    useMainThreadPressEvents(events, viewProps, useResponderFallback, debugName)

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

      if (hasRealPressEvents && !isInsideNativeMenu) {
        // Real handlers are delivered by useMainThreadPressEvents above. Clear
        // any cached pressStyle observer from an earlier render so it cannot
        // double-fire after onPress appears dynamically.
        gestureRef.current = null
        return null
      }

      // only create gesture once, callbacks are read from ref
      if (!gestureRef.current) {
        const { Gesture } = gh.state

        if (isInsideNativeMenu) {
          // Inside native menus on Android: use Manual gesture with manualActivation
          // so it never goes ACTIVE (which would send ACTION_CANCEL to MenuView).
          // Press callbacks fire via onTouchesDown/Up instead.
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
        } else if (!getIsAndroid()) {
          // pressStyle-only (events.onPress was synthesized to drive pressStyle
          // visuals, no user handler): use Manual + manualActivation. Touch
          // observation runs on the UI thread for fast pressStyle feedback,
          // but the gesture never activates → never claims responder/ownership,
          // so a real-handler ancestor still wins arbitration. This is the fix
          // for nested press scenarios like <Link asChild><View><Button/></View></Link>
          // where the View carries the merged navigate onPress and the inner
          // pressStyled Button must not steal the press.
          //
          // Android: skipped — see isAndroid comment at top. Synthesized
          // pressStyle handlers fall through to viewProps responder events.
          gestureRef.current = Gesture.Manual()
            .runOnJS(true)
            .manualActivation(true)
            .onTouchesDown((e: any) => callbacksRef.current.onPressIn?.(e))
            .onTouchesUp((e: any) => {
              callbacksRef.current.onPress?.(e)
              callbacksRef.current.onPressOut?.(e)
            })
            .onTouchesCancelled((e: any) => callbacksRef.current.onPressOut?.(e))
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
  _stateRef: { current: TamaguiComponentStateRef },
  isHOC?: boolean,
  isCompositeComponent?: boolean,
  hasRealPressEvents?: boolean
) {
  // Skip wrapping for HOC and composite components - they pass press events
  // to the inner component via props instead of using GestureDetector
  if (isHOC || isCompositeComponent) {
    return content
  }

  const gh = getGestureHandler()
  const { GestureDetector } = gh.state

  // Only wrap when useEvents actually produced an RNGH gesture. Real press
  // handlers are responder-delivered; wrapping them in a no-op GestureDetector
  // recreates the same stale Tap/dead-zone failure mode this path avoids.
  if (!GestureDetector || !gesture) {
    return content
  }

  // pressStyle-only observers (Manual + manualActivation gesture) must never
  // claim the responder — otherwise a nested pressStyle Tamagui child would
  // preempt a real-handler ancestor (e.g. <Link asChild><View><Button/></View></Link>
  // where the View carries the merged navigate handler and the inner Button
  // has only pressStyle). The Manual gesture observes touches on the UI thread
  // for fast pressStyle visuals without participating in arbitration.
  if (!hasRealPressEvents) {
    return React.createElement(GestureDetector, { gesture }, content)
  }

  if (isFabric) {
    // attach responder claim directly to the gesture target. on Fabric this
    // does not conflict with RNGH because the responder path goes through
    // nativeFabricUIManager.setIsJSResponder, not UIManager.setJSResponder
    // (which RNGH intercepts on Paper). avoids a wrapper view, so layout is
    // unchanged and we don't trip Fabric's display:contents -> ForceFlattenView.
    // The claim is what blocks a parent RN Pressable from firing when a press
    // lands on this Tamagui component (NestedPressExclusive).
    //
    // Do NOT also set onResponderTerminationRequest: false here — that would
    // refuse to release the responder when a parent ScrollView's pan tries to
    // take over, leaving the press stuck "down" for the whole scroll and
    // firing onPress on release. The default (allow termination) lets the
    // ScrollView scroll naturally while the start-claim still blocks parent
    // Pressables from receiving the touch.
    const claimed = React.cloneElement(content, {
      onStartShouldSetResponder: responderClaim,
    })
    return React.createElement(GestureDetector, { gesture }, claimed)
  }

  // Paper: keep the hoisted display:contents wrapper. claiming on the gesture
  // target itself triggers RNGH's setJSResponder coordination conflict and
  // freezes long lists (c345b5fc28). Same as Fabric, only claim on start —
  // don't deny termination, or parent ScrollViews can't take the responder
  // back when the user starts scrolling.
  return React.createElement(
    View,
    {
      collapsable: false,
      style: responderWrapperStyle,
      onStartShouldSetResponder: responderClaim,
    },
    React.createElement(GestureDetector, { gesture }, content)
  )
}
