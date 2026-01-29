/**
 * Native implementation of drag gesture handling for toast swipe-to-dismiss.
 * Uses react-native-gesture-handler when available, falls back to PanResponder.
 */

import * as React from 'react'
import type { PanResponderGestureState } from 'react-native'
import { PanResponder } from 'react-native'
import type { SwipeDirection } from './ToastProvider'

export interface DragState {
  isDragging: boolean
  offsetX: number
  offsetY: number
  velocityX: number
  velocityY: number
}

export interface UseDragGestureOptions {
  direction: SwipeDirection
  threshold: number
  onDragStart?: () => void
  onDragEnd?: (dismissed: boolean) => void
  onDragCancel?: () => void
  disabled?: boolean
}

const GESTURE_GRANT_THRESHOLD = 10
const VELOCITY_THRESHOLD = 0.11

function getDampening(delta: number): number {
  const factor = Math.abs(delta) / 20
  return 1 / (1.5 + factor)
}

function shouldGrantGestureMove(dir: SwipeDirection, dx: number, dy: number): boolean {
  if ((dir === 'horizontal' || dir === 'left') && dx < -GESTURE_GRANT_THRESHOLD) {
    return true
  }
  if ((dir === 'horizontal' || dir === 'right') && dx > GESTURE_GRANT_THRESHOLD) {
    return true
  }
  if ((dir === 'vertical' || dir === 'up') && dy < -GESTURE_GRANT_THRESHOLD) {
    return true
  }
  if ((dir === 'vertical' || dir === 'down') && dy > GESTURE_GRANT_THRESHOLD) {
    return true
  }
  return false
}

export function useDragGesture(options: UseDragGestureOptions) {
  const { direction, threshold, onDragStart, onDragEnd, onDragCancel, disabled } = options

  const [dragState, setDragState] = React.useState<DragState>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    velocityX: 0,
    velocityY: 0,
  })

  const dragStartTimeRef = React.useRef<number>(0)

  const isHorizontal =
    direction === 'left' || direction === 'right' || direction === 'horizontal'
  const isVertical =
    direction === 'up' || direction === 'down' || direction === 'vertical'

  const panResponder = React.useMemo(() => {
    if (disabled) return null

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gesture) => {
        return shouldGrantGestureMove(direction, gesture.dx, gesture.dy)
      },

      onPanResponderGrant: () => {
        dragStartTimeRef.current = Date.now()
        setDragState((prev) => ({ ...prev, isDragging: true }))
        onDragStart?.()
      },

      onPanResponderMove: (_e, gesture) => {
        const { dx, dy } = gesture

        let offsetX = 0
        let offsetY = 0

        // apply direction-aware movement with dampening
        if (isHorizontal) {
          if (
            (direction === 'right' && dx > 0) ||
            (direction === 'left' && dx < 0) ||
            direction === 'horizontal'
          ) {
            offsetX = dx
          } else {
            // dampened movement (resistive pull)
            offsetX = dx * getDampening(dx)
          }
        }

        if (isVertical) {
          if (
            (direction === 'down' && dy > 0) ||
            (direction === 'up' && dy < 0) ||
            direction === 'vertical'
          ) {
            offsetY = dy
          } else {
            // dampened movement (resistive pull)
            offsetY = dy * getDampening(dy)
          }
        }

        setDragState((prev) => ({
          ...prev,
          offsetX,
          offsetY,
        }))
      },

      onPanResponderRelease: (_e, gesture) => {
        const { dx, dy, vx, vy } = gesture

        const relevantDelta = isHorizontal ? dx : dy
        const relevantVelocity = isHorizontal ? Math.abs(vx) : Math.abs(vy)

        // check if swipe should dismiss
        const passedThreshold = Math.abs(relevantDelta) >= threshold
        const hasVelocity = relevantVelocity > VELOCITY_THRESHOLD

        // check if swipe is in the correct direction
        let isCorrectDirection = false
        if (direction === 'right' && dx > 0) isCorrectDirection = true
        else if (direction === 'left' && dx < 0) isCorrectDirection = true
        else if (direction === 'horizontal' && Math.abs(dx) > Math.abs(dy))
          isCorrectDirection = true
        else if (direction === 'down' && dy > 0) isCorrectDirection = true
        else if (direction === 'up' && dy < 0) isCorrectDirection = true
        else if (direction === 'vertical' && Math.abs(dy) > Math.abs(dx))
          isCorrectDirection = true

        const shouldDismiss = isCorrectDirection && (passedThreshold || hasVelocity)

        if (shouldDismiss) {
          onDragEnd?.(true)
        } else {
          // snap back
          setDragState({
            isDragging: false,
            offsetX: 0,
            offsetY: 0,
            velocityX: 0,
            velocityY: 0,
          })
          onDragCancel?.()
        }
      },

      onPanResponderTerminate: () => {
        setDragState({
          isDragging: false,
          offsetX: 0,
          offsetY: 0,
          velocityX: 0,
          velocityY: 0,
        })
        onDragCancel?.()
      },
    })
  }, [
    disabled,
    direction,
    threshold,
    isHorizontal,
    isVertical,
    onDragStart,
    onDragEnd,
    onDragCancel,
  ])

  const resetDrag = React.useCallback(() => {
    setDragState({
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      velocityX: 0,
      velocityY: 0,
    })
  }, [])

  return {
    dragState,
    gestureHandlers: panResponder?.panHandlers ?? {},
    resetDrag,
  }
}
