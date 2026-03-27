/**
 * Native ToastItem — uses Reanimated for 60fps stacking/gesture animations.
 *
 * Key patterns (proven in ToastReanimatedTest):
 * 1. Two-layer AnimatedView: outer (entering/exiting) + inner (useAnimatedStyle stacking)
 * 2. React.memo with custom comparator: only re-render on id/index change
 * 3. All gesture callbacks are worklets (no .runOnJS(true))
 * 4. Heights measured via SharedValue.modify() in onLayout worklet
 * 5. No per-item React state — only useSharedValue for gesture
 */

import { getGestureHandler } from '@tamagui/native'
import * as React from 'react'
import { View, useWindowDimensions } from 'react-native'
import {
  createAnimatedComponent,
  Easing,
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  Keyframe,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'

import type { ToastT } from './ToastState'
import { ToastItemFrame } from './ToastItemFrame'

// ─── Constants ──────────────────────────────────────────────────────────────

const DISMISS_THRESHOLD = 50
const VELOCITY_THRESHOLD = 500 // px/s
const RUBBER_MAX = 40
// snap-back spring — tuned to match web (damping: 30, stiffness: 400, mass: 0.5)
const SNAP_SPRING = { damping: 30, stiffness: 400, mass: 0.5 }
// hoisted animation configs — avoids allocating new objects on every worklet evaluation
const HEIGHT_SPRING = { damping: 100, stiffness: 1200, mass: 3 }
const STACK_TIMING = { duration: 300 }

const AnimatedView = createAnimatedComponent(View)

// ─── Layout Animations ─────────────────────────────────────────────────────

// clean slide-in without spring overshoot — matches web's 400ms CSS transition
const enteringBottom = FadeInDown.duration(300)
  .withInitialValues({ opacity: 1, transform: [{ translateY: 80 }] })
  .easing(Easing.out(Easing.cubic))

const enteringTop = FadeInUp.duration(300)
  .withInitialValues({ opacity: 1, transform: [{ translateY: -80 }] })
  .easing(Easing.out(Easing.cubic))

const exitingBottom = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
  100: {
    opacity: 0.5,
    transform: [{ translateY: 100 }, { scale: 0.97 }],
    easing: Easing.bezier(0.4, 0, 1, 1),
  },
}).duration(150)

const exitingTop = new Keyframe({
  0: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
  100: {
    opacity: 0.5,
    transform: [{ translateY: -100 }, { scale: 0.97 }],
    easing: Easing.bezier(0.4, 0, 1, 1),
  },
}).duration(150)

// ─── Props ──────────────────────────────────────────────────────────────────

export interface NativeToastItemProps {
  toast: ToastT
  index: number
  expanded: boolean
  gap: number
  total: SharedValue<number>
  heights: SharedValue<Record<string, number>>
  toastOrder: SharedValue<string[]>
  hide: (id: string) => void
  onTap?: () => void
  placement: 'top' | 'bottom'
  maxVisibleToasts: number
  reducedMotion?: boolean
  /** true only when this toast was just created (not revealed by dismissing another) */
  isNew?: boolean
  children: React.ReactNode
  testID?: string
}

// ─── Component ──────────────────────────────────────────────────────────────

export const NativeToastItem = React.memo(
  function NativeToastItem({
    toast,
    index,
    expanded,
    gap,
    total,
    heights,
    toastOrder,
    hide,
    onTap,
    placement,
    maxVisibleToasts,
    reducedMotion,
    isNew,
    children,
    testID,
  }: NativeToastItemProps) {
    const { height: screenHeight } = useWindowDimensions()
    const isTop = placement === 'top'
    const sign = isTop ? 1 : -1

    // ── Gesture shared values (UI thread only) ───────────────────
    const isDragging = useSharedValue(false)
    const gestureTranslateY = useSharedValue(0)
    const gestureTranslateX = useSharedValue(0)
    const gestureScale = useSharedValue(1)
    // 0 = not locked, 1 = horizontal, 2 = vertical
    const lockedAxis = useSharedValue(0)

    // ── Pan gesture (pure worklet callbacks) ─────────────────────
    const panGesture = React.useMemo(() => {
      const gh = getGestureHandler()
      if (!gh.isEnabled) return null
      const { Gesture } = gh.state
      if (!Gesture) return null

      return Gesture.Pan()
        .activeOffsetX([-10, 10])
        .activeOffsetY([-10, 10])
        .enabled(toast.dismissible !== false && toast.type !== 'loading')
        .onBegin(() => {
          'worklet'
          isDragging.set(true)
          gestureTranslateY.set(0)
          gestureTranslateX.set(0)
          gestureScale.set(0.995)
          lockedAxis.set(0) // reset axis lock
        })
        .onChange((event) => {
          'worklet'
          if (!isDragging.get()) return

          const { translationX, translationY } = event

          // lock axis on first significant movement (>5px) — stays locked for entire gesture
          if (lockedAxis.get() === 0) {
            if (Math.abs(translationX) > 5 || Math.abs(translationY) > 5) {
              lockedAxis.set(Math.abs(translationX) > Math.abs(translationY) ? 1 : 2)
            }
            return // wait until locked
          }

          const isHorizontalLocked = lockedAxis.get() === 1

          if (isHorizontalLocked) {
            // horizontal only — no vertical movement
            gestureTranslateX.set(translationX)
            gestureTranslateY.set(0)
          } else {
            // vertical only — no horizontal movement
            gestureTranslateX.set(0)
            if (isTop) {
              if (translationY < 0) {
                gestureTranslateY.set(translationY)
              } else {
                gestureTranslateY.set(
                  interpolate(translationY, [0, screenHeight], [0, RUBBER_MAX], Extrapolation.CLAMP)
                )
              }
            } else {
              if (translationY > 0) {
                gestureTranslateY.set(translationY)
              } else {
                gestureTranslateY.set(
                  -interpolate(
                    Math.abs(translationY),
                    [0, screenHeight],
                    [0, RUBBER_MAX],
                    Extrapolation.CLAMP
                  )
                )
              }
            }
          }
        })
        .onFinalize((event) => {
          'worklet'
          gestureScale.set(1)

          const { translationX, translationY, velocityX, velocityY } = event
          const axis = lockedAxis.get()
          let shouldDismiss = false

          // horizontal dismiss (only if locked to horizontal)
          if (axis === 1) {
            shouldDismiss =
              Math.abs(translationX) > DISMISS_THRESHOLD ||
              Math.abs(velocityX) > VELOCITY_THRESHOLD
            if (shouldDismiss) {
              gestureTranslateX.set(withDecay({ velocity: velocityX }))
              isDragging.set(false)
              runOnJS(hide)(String(toast.id))
              return
            }
          }

          // vertical dismiss (only if locked to vertical)
          if (axis === 2 && isTop && translationY < 0) {
            shouldDismiss =
              Math.abs(translationY) > DISMISS_THRESHOLD ||
              Math.abs(velocityY) > VELOCITY_THRESHOLD
            if (shouldDismiss) {
              gestureTranslateY.set(
                withDecay({ velocity: velocityY, clamp: [-Infinity, 0] })
              )
              isDragging.set(false)
              runOnJS(hide)(String(toast.id))
              return
            }
          } else if (axis === 2 && !isTop && translationY > 0) {
            shouldDismiss =
              Math.abs(translationY) > DISMISS_THRESHOLD ||
              Math.abs(velocityY) > VELOCITY_THRESHOLD
            if (shouldDismiss) {
              gestureTranslateY.set(
                withDecay({ velocity: velocityY, clamp: [0, Infinity] })
              )
              isDragging.set(false)
              runOnJS(hide)(String(toast.id))
              return
            }
          }

          // snap back — tuned to match web spring feel
          gestureTranslateY.set(withSpring(0, SNAP_SPRING))
          gestureTranslateX.set(withSpring(0, SNAP_SPRING))
          isDragging.set(false)
        })
    }, [toast.id, isTop, screenHeight, toast.dismissible, toast.type])

    // ── Tap gesture for expand/collapse ───────────────────────────
    const tapGesture = React.useMemo(() => {
      const gh = getGestureHandler()
      if (!gh.isEnabled || !onTap) return null
      const { Gesture } = gh.state
      if (!Gesture) return null

      return Gesture.Tap().onEnd(() => {
        'worklet'
        if (onTap) runOnJS(onTap)()
      })
    }, [onTap])

    // compose: tap and pan run simultaneously so tap works without blocking swipe
    const composedGesture = React.useMemo(() => {
      const gh = getGestureHandler()
      if (!gh.isEnabled) return null
      const { Gesture } = gh.state
      if (!Gesture || !panGesture) return panGesture

      if (tapGesture) {
        return Gesture.Simultaneous(tapGesture, panGesture)
      }
      return panGesture
    }, [panGesture, tapGesture])

    // ── Stacking style (UI thread worklet) ───────────────────────
    const rContainerStyle = useAnimatedStyle(() => {
      const zIndex = 1000 - index
      const heightsMap = heights.get()

      let stackTranslateY: number
      let stackScale: number
      let opacity: number
      let constrainedHeight: number | undefined

      if (expanded) {
        // ── EXPANDED MODE: full height-based offsets ──────────
        // use toastOrder (synced with rendered array) to calculate heights
        // this is correct even during exit animations because toastOrder
        // updates immediately when a toast is removed
        let heightBeforeMe = 0
        const order = toastOrder.get()
        for (let i = 0; i < Math.min(index, order.length); i++) {
          const h = heightsMap[order[i]]
          if (h && h > 0) {
            heightBeforeMe += h + gap
          }
        }

        stackTranslateY = heightBeforeMe * sign
        stackScale = 1
        // respect visibleToasts limit even in expanded mode
        opacity = index < maxVisibleToasts ? 1 : 0
        // use measured natural height — must explicitly set so the animated height
        // from collapsed mode (withSpring to front toast height) gets overridden
        const myId = order[index]
        const myHeight = myId ? heightsMap[myId] : undefined
        constrainedHeight = myHeight && myHeight > 0 ? myHeight : undefined
      } else {
        // ── COLLAPSED MODE: peek stacking ────────────────────
        stackScale = index === 0 ? 1 : Math.max(1 - index * 0.05, 0.85)
        stackTranslateY = index === 0 ? 0 : index * 10 * sign

        // opacity: fade out toasts beyond maxVisibleToasts
        if (index >= maxVisibleToasts) {
          opacity = 0
        } else if (index === maxVisibleToasts - 1) {
          opacity = 0.5
        } else {
          opacity = 1
        }

        // height: constrain back toasts to front toast height for uniform stacking
        // use toastOrder[0] explicitly — Object.keys insertion order is non-deterministic
        // when multiple toasts mount simultaneously
        const frontId = toastOrder.get()[0]
        const frontHeight = frontId ? heightsMap[frontId] : undefined
        constrainedHeight = index > 0 && frontHeight ? frontHeight : undefined
      }

      // in collapsed mode: gesture replaces stack position (toast is at bottom:0)
      // in expanded mode: gesture adds to stack position (toast is at its expanded offset)
      let translateY: number
      let scale: number

      if (isDragging.get()) {
        translateY = expanded
          ? stackTranslateY + gestureTranslateY.get()  // additive in expanded
          : gestureTranslateY.get()                     // replacement in collapsed
        scale = gestureScale.get()
      } else {
        translateY = stackTranslateY
        scale = stackScale
      }

      return {
        zIndex,
        height: constrainedHeight
          ? withSpring(constrainedHeight, HEIGHT_SPRING)
          : undefined,
        pointerEvents: opacity === 0 ? ('none' as const) : ('auto' as const),
        opacity: withTiming(opacity, STACK_TIMING),
        transform: [
          { translateX: gestureTranslateX.get() },
          {
            translateY: isDragging.get()
              ? translateY
              : withTiming(translateY, STACK_TIMING),
          },
          {
            scale: isDragging.get()
              ? withSpring(scale)
              : withTiming(scale, STACK_TIMING),
          },
        ],
      }
    })

    // ── Render ───────────────────────────────────────────────────
    // capture isNew on mount — if the parent re-renders with isNew=false (e.g. when a
    // newer toast pushes this one to index 1), we must NOT change the entering prop
    // mid-animation or Reanimated cancels the running entering animation causing a jump
    const isNewRef = React.useRef(isNew)
    const enterAnim = isNewRef.current && !reducedMotion ? (isTop ? enteringTop : enteringBottom) : undefined
    const exitAnim = reducedMotion ? undefined : isTop ? exitingTop : exitingBottom
    const GestureDetector = getGestureHandler().state.GestureDetector

    const content = (
      <AnimatedView
        testID={testID}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          zIndex: 1000 - index,
          ...(isTop ? { top: 0 } : { bottom: 0 }),
        }}
        entering={enterAnim}
        exiting={exitAnim}
      >
        {/* Animated toast (stacking + gesture) */}
        <AnimatedView style={rContainerStyle}>
          <ToastItemFrame
            role="status"
            aria-live="polite"
            aria-atomic
          >
            {children}
          </ToastItemFrame>
        </AnimatedView>

        {/* Hidden measurement copy */}
        <ToastItemFrame
          pointerEvents="none"
          position="absolute"
          opacity={0}
          onLayout={(e: any) => {
            const h = e.nativeEvent.layout.height
            ;(heights as any).modify((v: any) => {
              'worklet'
              return { ...v, [String(toast.id)]: h }
            })
          }}
        >
          {children}
        </ToastItemFrame>
      </AnimatedView>
    )

    const activeGesture = composedGesture || panGesture
    if (activeGesture && GestureDetector) {
      return <GestureDetector gesture={activeGesture}>{content}</GestureDetector>
    }

    return content
  },
  // Custom memo comparator — only re-render when id or index changes.
  // total, heights, hide are SharedValues/stable refs — they don't need re-renders.
  (prev, next) =>
    prev.toast.id === next.toast.id &&
    prev.index === next.index &&
    prev.expanded === next.expanded
)
