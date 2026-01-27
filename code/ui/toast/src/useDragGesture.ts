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
 * Apply Sonner-style dampening when dragging against allowed direction.
 * Uses 1 / (1.5 + factor) curve which feels smooth and natural.
 * @param delta - the drag distance (can be positive or negative)
 */
function getDampening(delta: number): number {
  const factor = Math.abs(delta) / 20
  return 1 / (1.5 + factor)
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
      if (event.button !== 0) return // only left click

      // skip drag if clicking on interactive elements (buttons, links, inputs, etc.)
      const target = event.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const interactiveTags = ['button', 'a', 'input', 'select', 'textarea']
      if (interactiveTags.includes(tagName)) {
        return
      }
      // check for ARIA roles and explicit focusable elements
      const role = target.getAttribute('role')
      if (role === 'button' || role === 'link') {
        return
      }
      // check if clicking inside an interactive element
      if (target.closest('button, a, input, select, textarea, [role="button"], [role="link"]')) {
        return
      }

      // capture pointer for drag outside element
      target.setPointerCapture(event.pointerId)

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

      // apply Sonner-style dampening: full movement in allowed direction,
      // dampened movement in opposite direction
      if (lockedDirectionRef.current === 'x' && isHorizontal) {
        if (direction === 'right') {
          // swipe right: full movement right, dampened left
          offsetX = deltaX > 0 ? deltaX : deltaX * getDampening(deltaX)
        } else if (direction === 'left') {
          // swipe left: full movement left, dampened right
          offsetX = deltaX < 0 ? deltaX : deltaX * getDampening(deltaX)
        } else {
          // horizontal: full movement both directions
          offsetX = deltaX
        }
      } else if (lockedDirectionRef.current === 'y' && isVertical) {
        if (direction === 'down') {
          // swipe down: full movement down, dampened up
          offsetY = deltaY > 0 ? deltaY : deltaY * getDampening(deltaY)
        } else if (direction === 'up') {
          // swipe up: full movement up, dampened down
          offsetY = deltaY < 0 ? deltaY : deltaY * getDampening(deltaY)
        } else {
          // vertical: full movement both directions
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
