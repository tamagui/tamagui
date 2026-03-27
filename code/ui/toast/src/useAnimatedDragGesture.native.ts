/**
 * Native implementation of drag gesture handling for the OLD toast path (ToastItem/Toaster).
 * The NEW native toast path (NativeToastItem.native.tsx) has its own worklet-based
 * gesture handling and does NOT use this file. This file is only loaded because
 * ToastItemInner calls useAnimatedDragGesture unconditionally (React hooks rule).
 *
 * Uses react-native-gesture-handler (RNGH) when available for proper gesture
 * coordination with ScrollView and navigation. Falls back to PanResponder.
 *
 * Pattern: same as Sheet — RNGH is accessed through @tamagui/native global
 * registry, never imported directly. The gesture is created in useMemo and
 * returns null when RNGH is not set up.
 */

import { getGestureHandler } from '@tamagui/native'
import * as React from 'react'
import type { PanResponderGestureState } from 'react-native'
import { PanResponder } from 'react-native'
import type { SwipeDirection } from './ToastProvider'

export interface UseAnimatedDragGestureOptions {
  direction: SwipeDirection
  threshold: number
  disabled?: boolean
  expanded?: boolean
  onDragMove: (x: number, y: number) => void
  onDragStart?: () => void
  onDismiss: (exitDirection: 'left' | 'right' | 'up' | 'down', velocity: number) => void
  onCancel: () => void
}

const VELOCITY_THRESHOLD = 0.11
const GESTURE_GRANT_THRESHOLD = 10

function resisted(delta: number, maxResist = 25): number {
  if (delta >= 0) return delta
  const pastBoundary = Math.abs(delta)
  const resistedDistance = Math.sqrt(pastBoundary) * 2
  return -Math.min(resistedDistance, maxResist)
}

const EXIT_DRAG_CAP = 80

function cappedExit(delta: number): number {
  if (Math.abs(delta) <= EXIT_DRAG_CAP) return delta
  const sign = delta > 0 ? 1 : -1
  const overshoot = Math.abs(delta) - EXIT_DRAG_CAP
  return sign * (EXIT_DRAG_CAP + Math.sqrt(overshoot) * 2)
}

function computeOffset(
  direction: SwipeDirection,
  dx: number,
  dy: number
): { offsetX: number; offsetY: number } {
  let offsetX = 0
  let offsetY = 0

  if (direction === 'right') {
    offsetX = dx > 0 ? cappedExit(dx) : resisted(dx)
  } else if (direction === 'left') {
    offsetX = dx < 0 ? cappedExit(dx) : -resisted(-dx)
  } else if (direction === 'down') {
    offsetY = dy > 0 ? cappedExit(dy) : resisted(dy)
  } else if (direction === 'up') {
    offsetY = dy < 0 ? cappedExit(dy) : -resisted(-dy)
  } else if (direction === 'horizontal') {
    offsetX = cappedExit(dx)
  } else if (direction === 'vertical') {
    offsetY = cappedExit(dy)
  }

  return { offsetX, offsetY }
}

function computeExitDirection(
  direction: SwipeDirection,
  dx: number,
  dy: number
): 'left' | 'right' | 'up' | 'down' | null {
  if (direction === 'right' && dx > 0) return 'right'
  if (direction === 'left' && dx < 0) return 'left'
  if (direction === 'horizontal') {
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left'
  }
  if (direction === 'down' && dy > 0) return 'down'
  if (direction === 'up' && dy < 0) return 'up'
  if (direction === 'vertical') {
    if (Math.abs(dy) > Math.abs(dx)) return dy > 0 ? 'down' : 'up'
  }
  return null
}

function shouldGrantGestureMove(dir: SwipeDirection, dx: number, dy: number): boolean {
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  if (
    (dir === 'horizontal' || dir === 'left' || dir === 'right') &&
    absDx > GESTURE_GRANT_THRESHOLD &&
    absDx > absDy
  ) {
    return true
  }
  if (
    (dir === 'vertical' || dir === 'up' || dir === 'down') &&
    absDy > GESTURE_GRANT_THRESHOLD &&
    absDy > absDx
  ) {
    return true
  }
  return false
}

/**
 * Single hook — always calls the same hooks in the same order.
 * Creates RNGH gesture in useMemo (returns null if unavailable).
 * Creates PanResponder in useMemo (returns null if RNGH is used).
 * Consumer checks `gesture` to decide whether to wrap with GestureDetector.
 */
export function useAnimatedDragGesture(options: UseAnimatedDragGestureOptions) {
  const { direction, threshold, disabled } = options

  const [isDragging, setIsDragging] = React.useState(false)

  const isHorizontal =
    direction === 'left' || direction === 'right' || direction === 'horizontal'

  const gestureRef = React.useRef<any>(null)

  // store callbacks in refs for stable closures
  const onDragMoveRef = React.useRef(options.onDragMove)
  const onDragStartRef = React.useRef(options.onDragStart)
  const onDismissRef = React.useRef(options.onDismiss)
  const onCancelRef = React.useRef(options.onCancel)
  onDragMoveRef.current = options.onDragMove
  onDragStartRef.current = options.onDragStart
  onDismissRef.current = options.onDismiss
  onCancelRef.current = options.onCancel

  // check once — RNGH availability is set at app init and never changes
  const rnghEnabled = getGestureHandler().isEnabled

  // RNGH gesture (null if not available)
  const gesture = React.useMemo(() => {
    if (!rnghEnabled || disabled) return null

    const { Gesture } = getGestureHandler().state
    if (!Gesture) return null

    const pan = Gesture.Pan()
      .withRef(gestureRef)
      .shouldCancelWhenOutside(false)
      .runOnJS(true)

    if (isHorizontal) {
      pan.activeOffsetX([-10, 10])
      pan.failOffsetY([-20, 20])
    } else {
      pan.activeOffsetY([-10, 10])
      pan.failOffsetX([-20, 20])
    }

    pan
      .onStart(() => {
        setIsDragging(true)
        onDragStartRef.current?.()
      })
      .onChange((event: any) => {
        const { offsetX, offsetY } = computeOffset(
          direction,
          event.translationX,
          event.translationY
        )
        onDragMoveRef.current(offsetX, offsetY)
      })
      .onEnd((event: any) => {
        const dx = event.translationX
        const dy = event.translationY
        const relevantDelta = isHorizontal ? dx : dy
        const relevantVelocity = isHorizontal
          ? Math.abs(event.velocityX / 1000)
          : Math.abs(event.velocityY / 1000)

        const passedThreshold = Math.abs(relevantDelta) >= threshold
        const hasVelocity = relevantVelocity > VELOCITY_THRESHOLD
        const exitDirection = computeExitDirection(direction, dx, dy)
        const shouldDismiss = exitDirection && (passedThreshold || hasVelocity)

        setIsDragging(false)

        if (shouldDismiss && exitDirection) {
          onDismissRef.current(exitDirection, relevantVelocity)
        } else {
          onCancelRef.current()
        }
      })
      .onFinalize(() => {
        setIsDragging(false)
      })

    return pan
  }, [disabled, direction, threshold, isHorizontal, rnghEnabled])

  // PanResponder fallback (null if RNGH is used)
  const panResponder = React.useMemo(() => {
    if (rnghEnabled || disabled) return null

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => {
        return shouldGrantGestureMove(direction, g.dx, g.dy)
      },
      onMoveShouldSetPanResponderCapture: (_e, g) => {
        return shouldGrantGestureMove(direction, g.dx, g.dy)
      },
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: () => {
        setIsDragging(true)
        onDragStartRef.current?.()
      },

      onPanResponderMove: (_e, g: PanResponderGestureState) => {
        const { offsetX, offsetY } = computeOffset(direction, g.dx, g.dy)
        onDragMoveRef.current(offsetX, offsetY)
      },

      onPanResponderRelease: (_e, g: PanResponderGestureState) => {
        const { dx, dy, vx, vy } = g
        const relevantDelta = isHorizontal ? dx : dy
        const relevantVelocity = isHorizontal ? Math.abs(vx) : Math.abs(vy)

        const passedThreshold = Math.abs(relevantDelta) >= threshold
        const hasVelocity = relevantVelocity > VELOCITY_THRESHOLD
        const exitDirection = computeExitDirection(direction, dx, dy)
        const shouldDismiss = exitDirection && (passedThreshold || hasVelocity)

        setIsDragging(false)

        if (shouldDismiss && exitDirection) {
          onDismissRef.current(exitDirection, relevantVelocity)
        } else {
          onCancelRef.current()
        }
      },

      onPanResponderTerminate: () => {
        setIsDragging(false)
        onCancelRef.current()
      },
    })
  }, [disabled, direction, threshold, isHorizontal, rnghEnabled])

  return {
    isDragging,
    gestureHandlers: panResponder?.panHandlers ?? {},
    gesture,
  }
}
