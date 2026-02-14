/**
 * Native implementation of drag gesture handling with animation driver integration.
 * Uses PanResponder for gesture tracking, animation driver for transforms.
 */

import * as React from 'react'
import type { PanResponderGestureState } from 'react-native'
import { PanResponder } from 'react-native'
import type { SwipeDirection } from './ToastProvider'

export interface UseAnimatedDragGestureOptions {
  direction: SwipeDirection
  threshold: number
  disabled?: boolean
  /** when collapsed, allow drag in all directions with resistance except exit direction */
  expanded?: boolean
  /** called during drag with offset values */
  onDragMove: (x: number, y: number) => void
  /** called when drag starts */
  onDragStart?: () => void
  /** called when drag ends with successful dismiss - includes exit direction and velocity */
  onDismiss: (exitDirection: 'left' | 'right' | 'up' | 'down', velocity: number) => void
  /** called when drag ends without dismiss - spring back */
  onCancel: () => void
}

const GESTURE_GRANT_THRESHOLD = 10
const VELOCITY_THRESHOLD = 0.11

/**
 * Apply resistance when dragging past a boundary.
 * Uses a square root curve for natural-feeling resistance (same as Sheet).
 */
function resisted(delta: number, maxResist = 25): number {
  if (delta >= 0) return delta
  const pastBoundary = Math.abs(delta)
  const resistedDistance = Math.sqrt(pastBoundary) * 2
  return -Math.min(resistedDistance, maxResist)
}

function shouldGrantGestureMove(dir: SwipeDirection, dx: number, dy: number): boolean {
  const absDx = Math.abs(dx)
  const absDy = Math.abs(dy)
  // grant gesture for movement along the swipe axis in either direction
  // (wrong direction gets resistance in onPanResponderMove)
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

export function useAnimatedDragGesture(options: UseAnimatedDragGestureOptions) {
  const { direction, threshold, disabled, onDragMove, onDragStart, onDismiss, onCancel } =
    options

  const [isDragging, setIsDragging] = React.useState(false)

  const isHorizontal =
    direction === 'left' || direction === 'right' || direction === 'horizontal'
  const isVertical =
    direction === 'up' || direction === 'down' || direction === 'vertical'

  // Store callbacks in refs so PanResponder doesn't need to be recreated
  // when callback identities change (which happens every render for inline arrows)
  const onDragMoveRef = React.useRef(onDragMove)
  const onDragStartRef = React.useRef(onDragStart)
  const onDismissRef = React.useRef(onDismiss)
  const onCancelRef = React.useRef(onCancel)
  onDragMoveRef.current = onDragMove
  onDragStartRef.current = onDragStart
  onDismissRef.current = onDismiss
  onCancelRef.current = onCancel

  const panResponder = React.useMemo(() => {
    if (disabled) return null

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gesture) => {
        return shouldGrantGestureMove(direction, gesture.dx, gesture.dy)
      },
      // capture phase: steal gesture from parent ScrollView when swiping in dismiss direction
      onMoveShouldSetPanResponderCapture: (_e, gesture) => {
        return shouldGrantGestureMove(direction, gesture.dx, gesture.dy)
      },

      onPanResponderGrant: () => {
        setIsDragging(true)
        onDragStartRef.current?.()
      },

      onPanResponderMove: (_e, gesture: PanResponderGestureState) => {
        const { dx, dy } = gesture

        let offsetX = 0
        let offsetY = 0

        // apply direction-aware movement with resistance for wrong direction
        if (isHorizontal) {
          if (direction === 'right') {
            offsetX = dx > 0 ? dx : resisted(dx)
          } else if (direction === 'left') {
            offsetX = dx < 0 ? dx : -resisted(-dx)
          } else {
            offsetX = dx
          }
        }

        if (isVertical) {
          if (direction === 'down') {
            offsetY = dy > 0 ? dy : resisted(dy)
          } else if (direction === 'up') {
            offsetY = dy < 0 ? dy : -resisted(-dy)
          } else {
            offsetY = dy
          }
        }

        // directly update animated values (no React state)
        onDragMoveRef.current(offsetX, offsetY)
      },

      onPanResponderRelease: (_e, gesture: PanResponderGestureState) => {
        const { dx, dy, vx, vy } = gesture

        const relevantDelta = isHorizontal ? dx : dy
        const relevantVelocity = isHorizontal ? Math.abs(vx) : Math.abs(vy)

        const passedThreshold = Math.abs(relevantDelta) >= threshold
        const hasVelocity = relevantVelocity > VELOCITY_THRESHOLD

        // determine exit direction
        let exitDirection: 'left' | 'right' | 'up' | 'down' | null = null
        if (direction === 'right' && dx > 0) exitDirection = 'right'
        else if (direction === 'left' && dx < 0) exitDirection = 'left'
        else if (direction === 'horizontal') {
          if (Math.abs(dx) > Math.abs(dy)) {
            exitDirection = dx > 0 ? 'right' : 'left'
          }
        } else if (direction === 'down' && dy > 0) exitDirection = 'down'
        else if (direction === 'up' && dy < 0) exitDirection = 'up'
        else if (direction === 'vertical') {
          if (Math.abs(dy) > Math.abs(dx)) {
            exitDirection = dy > 0 ? 'down' : 'up'
          }
        }

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
  }, [disabled, direction, threshold, isHorizontal, isVertical])

  return {
    isDragging,
    gestureHandlers: panResponder?.panHandlers ?? {},
  }
}
