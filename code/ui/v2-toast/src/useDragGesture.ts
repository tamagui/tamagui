/**
 * Web implementation of drag gesture handling for toast swipe-to-dismiss.
 * Uses pointer events for smooth drag tracking.
 */

import * as React from 'react'
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

interface DragStartData {
  startX: number
  startY: number
  startTime: number
}

const VELOCITY_THRESHOLD = 0.11

/**
 * Apply resistance when dragging past a boundary.
 * Uses a square root curve for natural-feeling resistance (same as Sheet).
 * @param delta - the drag distance
 * @param maxResist - maximum resistant distance (default 25px)
 */
function resisted(delta: number, maxResist = 25): number {
  // no resistance for drag in allowed direction
  if (delta >= 0) return delta

  // square root curve for gentle resistance
  const pastBoundary = Math.abs(delta)
  const resistedDistance = Math.sqrt(pastBoundary) * 2

  // cap at max resist distance
  return -Math.min(resistedDistance, maxResist)
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

  const dragStartRef = React.useRef<DragStartData | null>(null)
  const lockedDirectionRef = React.useRef<'x' | 'y' | null>(null)

  const isHorizontal =
    direction === 'left' || direction === 'right' || direction === 'horizontal'
  const isVertical =
    direction === 'up' || direction === 'down' || direction === 'vertical'

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      if (disabled) return
      if (event.button !== 0)
        return // only left click
        // capture pointer for drag outside element
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)

      dragStartRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startTime: Date.now(),
      }

      setDragState((prev) => ({ ...prev, isDragging: true }))
      onDragStart?.()
    },
    [disabled, onDragStart]
  )

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent) => {
      if (!dragStartRef.current || disabled) return

      const deltaX = event.clientX - dragStartRef.current.startX
      const deltaY = event.clientY - dragStartRef.current.startY

      // detect direction lock on first significant movement
      if (!lockedDirectionRef.current && (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1)) {
        lockedDirectionRef.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
      }

      let offsetX = 0
      let offsetY = 0

      // apply direction-aware movement with resistance for wrong direction
      if (lockedDirectionRef.current === 'x' && isHorizontal) {
        if (direction === 'right') {
          // swipe right: free movement right (positive), resisted left (negative)
          offsetX = deltaX > 0 ? deltaX : resisted(deltaX)
        } else if (direction === 'left') {
          // swipe left: free movement left (negative), resisted right (positive)
          offsetX = deltaX < 0 ? deltaX : -resisted(-deltaX)
        } else {
          // horizontal: free movement both directions
          offsetX = deltaX
        }
      } else if (lockedDirectionRef.current === 'y' && isVertical) {
        if (direction === 'down') {
          // swipe down: free movement down (positive), resisted up (negative)
          offsetY = deltaY > 0 ? deltaY : resisted(deltaY)
        } else if (direction === 'up') {
          // swipe up: free movement up (negative), resisted down (positive)
          offsetY = deltaY < 0 ? deltaY : -resisted(-deltaY)
        } else {
          // vertical: free movement both directions
          offsetY = deltaY
        }
      }

      setDragState((prev) => ({
        ...prev,
        offsetX,
        offsetY,
      }))
    },
    [disabled, direction, isHorizontal, isVertical]
  )

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent) => {
      if (!dragStartRef.current || disabled) return

      const deltaX = event.clientX - dragStartRef.current.startX
      const deltaY = event.clientY - dragStartRef.current.startY
      const timeTaken = Date.now() - dragStartRef.current.startTime

      // calculate velocity
      const velocityX = Math.abs(deltaX) / timeTaken
      const velocityY = Math.abs(deltaY) / timeTaken

      const relevantDelta = isHorizontal ? deltaX : deltaY
      const relevantVelocity = isHorizontal ? velocityX : velocityY

      // check if swipe should dismiss
      const passedThreshold = Math.abs(relevantDelta) >= threshold
      const hasVelocity = relevantVelocity > VELOCITY_THRESHOLD

      // check if swipe is in the correct direction
      let isCorrectDirection = false
      if (direction === 'right' && deltaX > 0) isCorrectDirection = true
      else if (direction === 'left' && deltaX < 0) isCorrectDirection = true
      else if (direction === 'horizontal' && Math.abs(deltaX) > Math.abs(deltaY))
        isCorrectDirection = true
      else if (direction === 'down' && deltaY > 0) isCorrectDirection = true
      else if (direction === 'up' && deltaY < 0) isCorrectDirection = true
      else if (direction === 'vertical' && Math.abs(deltaY) > Math.abs(deltaX))
        isCorrectDirection = true

      const shouldDismiss = isCorrectDirection && (passedThreshold || hasVelocity)

      // reset state
      dragStartRef.current = null
      lockedDirectionRef.current = null

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
    [disabled, direction, threshold, isHorizontal, onDragEnd, onDragCancel]
  )

  const handlePointerCancel = React.useCallback(() => {
    dragStartRef.current = null
    lockedDirectionRef.current = null
    setDragState({
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      velocityX: 0,
      velocityY: 0,
    })
    onDragCancel?.()
  }, [onDragCancel])

  const gestureHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
  }

  return {
    dragState,
    gestureHandlers,
    resetDrag: handlePointerCancel,
  }
}
