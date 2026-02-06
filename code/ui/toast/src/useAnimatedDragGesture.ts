/**
 * Web implementation of drag gesture handling with animation driver integration.
 * Uses pointer events for smooth drag tracking, animation driver for transforms.
 */

import * as React from 'react'
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

interface DragStartData {
  startX: number
  startY: number
  startTime: number
  pointerId: number
}

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

export function useAnimatedDragGesture(options: UseAnimatedDragGestureOptions) {
  const {
    direction,
    threshold,
    disabled,
    expanded,
    onDragMove,
    onDragStart,
    onDismiss,
    onCancel,
  } = options

  const [isDragging, setIsDragging] = React.useState(false)

  const dragStartRef = React.useRef<DragStartData | null>(null)
  const lockedDirectionRef = React.useRef<'x' | 'y' | null>(null)
  // Stable ref for pointer capture - avoids issues with event.target changing
  const captureElementRef = React.useRef<HTMLElement | null>(null)

  const isHorizontal =
    direction === 'left' || direction === 'right' || direction === 'horizontal'
  const isVertical =
    direction === 'up' || direction === 'down' || direction === 'vertical'

  // Cleanup function to reset all drag state
  const cleanup = React.useCallback(() => {
    dragStartRef.current = null
    lockedDirectionRef.current = null
    setIsDragging(false)
  }, [])

  // Defensive cleanup on unmount - if toast unmounts while dragging
  React.useEffect(() => {
    return () => {
      if (dragStartRef.current) {
        // Release pointer capture if we have it
        if (captureElementRef.current && dragStartRef.current.pointerId) {
          try {
            captureElementRef.current.releasePointerCapture(
              dragStartRef.current.pointerId
            )
          } catch {
            // ignore
          }
        }
        cleanup()
        // Note: can't call onCancel here as component is unmounting
      }
    }
  }, [cleanup])

  const handlePointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      if (disabled) return
      if (event.button !== 0) return

      // don't start drag if clicking on interactive elements (buttons, links, inputs)
      const target = event.target as HTMLElement
      if (target.closest('button, a, input, textarea, select, [role="button"]')) {
        return
      }

      // don't start drag if user has text selected (let them copy it)
      const hasSelection = (window.getSelection()?.toString().length ?? 0) > 0
      if (hasSelection) return

      // Use currentTarget (the element with the handler) for stable capture
      const captureElement = event.currentTarget as HTMLElement
      captureElementRef.current = captureElement
      captureElement.setPointerCapture(event.pointerId)

      dragStartRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startTime: Date.now(),
        pointerId: event.pointerId,
      }

      setIsDragging(true)
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

      // when collapsed, allow drag in all directions with resistance except exit direction
      // this feels more interactive like Sonner
      if (!expanded) {
        // exit direction gets free movement, all others get resistance
        if (direction === 'right') {
          offsetX = deltaX > 0 ? deltaX : resisted(deltaX)
          offsetY = deltaY > 0 ? -resisted(-deltaY) : resisted(deltaY)
        } else if (direction === 'left') {
          offsetX = deltaX < 0 ? deltaX : -resisted(-deltaX)
          offsetY = deltaY > 0 ? -resisted(-deltaY) : resisted(deltaY)
        } else if (direction === 'down') {
          offsetY = deltaY > 0 ? deltaY : resisted(deltaY)
          offsetX = deltaX > 0 ? -resisted(-deltaX) : resisted(deltaX)
        } else if (direction === 'up') {
          offsetY = deltaY < 0 ? deltaY : -resisted(-deltaY)
          offsetX = deltaX > 0 ? -resisted(-deltaX) : resisted(deltaX)
        } else if (direction === 'horizontal') {
          offsetX = deltaX
          offsetY = deltaY > 0 ? -resisted(-deltaY) : resisted(deltaY)
        } else if (direction === 'vertical') {
          offsetY = deltaY
          offsetX = deltaX > 0 ? -resisted(-deltaX) : resisted(deltaX)
        }
      } else {
        // when expanded, only allow movement in the configured swipe direction
        if (lockedDirectionRef.current === 'x' && isHorizontal) {
          if (direction === 'right') {
            offsetX = deltaX > 0 ? deltaX : resisted(deltaX)
          } else if (direction === 'left') {
            offsetX = deltaX < 0 ? deltaX : -resisted(-deltaX)
          } else {
            offsetX = deltaX
          }
        } else if (lockedDirectionRef.current === 'y' && isVertical) {
          if (direction === 'down') {
            offsetY = deltaY > 0 ? deltaY : resisted(deltaY)
          } else if (direction === 'up') {
            offsetY = deltaY < 0 ? deltaY : -resisted(-deltaY)
          } else {
            offsetY = deltaY
          }
        }
      }

      // directly update animated values (no React state update during drag)
      onDragMove(offsetX, offsetY)
    },
    [disabled, direction, expanded, isHorizontal, isVertical, onDragMove]
  )

  const handlePointerUp = React.useCallback(
    (event: React.PointerEvent) => {
      if (!dragStartRef.current || disabled) return

      const deltaX = event.clientX - dragStartRef.current.startX
      const deltaY = event.clientY - dragStartRef.current.startY
      const timeTaken = Date.now() - dragStartRef.current.startTime

      const velocityX = Math.abs(deltaX) / timeTaken
      const velocityY = Math.abs(deltaY) / timeTaken

      const lockedDirection = lockedDirectionRef.current

      // if locked to wrong axis for the swipe direction, don't dismiss
      // e.g., if drag started vertical but swipe direction is horizontal
      const isLockedToWrongAxis =
        (lockedDirection === 'y' && isHorizontal) ||
        (lockedDirection === 'x' && isVertical)

      const relevantDelta = isHorizontal ? deltaX : deltaY
      const relevantVelocity = isHorizontal ? velocityX : velocityY

      const passedThreshold = Math.abs(relevantDelta) >= threshold
      const hasVelocity = relevantVelocity > VELOCITY_THRESHOLD

      // determine exit direction based on actual drag direction
      let exitDirection: 'left' | 'right' | 'up' | 'down' | null = null

      // only set exit direction if not locked to wrong axis
      if (!isLockedToWrongAxis) {
        if (direction === 'right' && deltaX > 0) exitDirection = 'right'
        else if (direction === 'left' && deltaX < 0) exitDirection = 'left'
        else if (direction === 'horizontal') {
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            exitDirection = deltaX > 0 ? 'right' : 'left'
          }
        } else if (direction === 'down' && deltaY > 0) exitDirection = 'down'
        else if (direction === 'up' && deltaY < 0) exitDirection = 'up'
        else if (direction === 'vertical') {
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            exitDirection = deltaY > 0 ? 'down' : 'up'
          }
        }
      }

      const shouldDismiss = exitDirection && (passedThreshold || hasVelocity)

      // release pointer capture using stable ref
      if (captureElementRef.current) {
        try {
          captureElementRef.current.releasePointerCapture(event.pointerId)
        } catch {
          // ignore if already released
        }
      }

      // reset state
      cleanup()

      if (shouldDismiss && exitDirection) {
        onDismiss(exitDirection, relevantVelocity)
      } else {
        onCancel()
      }
    },
    [
      disabled,
      direction,
      threshold,
      isHorizontal,
      isVertical,
      onDismiss,
      onCancel,
      cleanup,
    ]
  )

  const handlePointerCancel = React.useCallback(
    (event: React.PointerEvent) => {
      // release pointer capture using stable ref
      if (captureElementRef.current) {
        try {
          captureElementRef.current.releasePointerCapture(event.pointerId)
        } catch {
          // ignore if already released
        }
      }

      cleanup()
      onCancel()
    },
    [onCancel, cleanup]
  )

  // Handle lost pointer capture - treat like cancel
  const handleLostPointerCapture = React.useCallback(() => {
    if (dragStartRef.current) {
      cleanup()
      onCancel()
    }
  }, [onCancel, cleanup])

  const gestureHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerCancel,
    onLostPointerCapture: handleLostPointerCapture,
  }

  return {
    isDragging,
    gestureHandlers,
  }
}
