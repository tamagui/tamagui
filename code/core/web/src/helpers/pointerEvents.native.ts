/**
 * Native pointer events - maps pointer events to touch/responder events
 *
 * Implements setPointerCapture/releasePointerCapture on the event target
 * to match web API for drag scenarios.
 */
import { useRef } from 'react'
import { composeEventHandlers } from '@tamagui/helpers'

export function usePointerEvents(props: any, viewProps: any) {
  const {
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerCancel,
    onPointerEnter,
    onPointerLeave,
  } = props

  const hasPointerEvents =
    onPointerDown ||
    onPointerUp ||
    onPointerMove ||
    onPointerCancel ||
    onPointerEnter ||
    onPointerLeave

  // single ref-bag (was three separate useRef slots) — one hook slot per
  // component instead of three. isInside = pointer within bounds (enter/leave),
  // layout = measured bounds, isCaptured = setPointerCapture state for moves.
  const ref = useRef<{
    isInside: boolean
    layout: { width: number; height: number }
    isCaptured: boolean
  } | null>(null)
  if (!ref.current) {
    ref.current = { isInside: false, layout: { width: 0, height: 0 }, isCaptured: false }
  }

  if (!hasPointerEvents) return
  const bag = ref.current

  // create normalized event with setPointerCapture support
  const createNormalizedEvent = (e: any) => {
    const touch = e.nativeEvent
    const normalized: any = {
      ...e,
      clientX: touch.pageX,
      clientY: touch.pageY,
      pageX: touch.pageX,
      pageY: touch.pageY,
      offsetX: touch.locationX,
      offsetY: touch.locationY,
      pointerType: 'touch' as const,
      pointerId: touch.identifier ?? 0,
      nativeEvent: touch,
      target: {
        setPointerCapture: (_pointerId: number) => {
          bag.isCaptured = true
        },
        releasePointerCapture: (_pointerId: number) => {
          bag.isCaptured = false
        },
      },
    }
    return normalized
  }

  // pointer down
  if (onPointerDown) {
    viewProps.onTouchStart = composeEventHandlers(viewProps.onTouchStart, (e: any) => {
      onPointerDown(createNormalizedEvent(e))
    })
  }

  // pointer up
  if (onPointerUp) {
    viewProps.onTouchEnd = composeEventHandlers(viewProps.onTouchEnd, (e: any) => {
      bag.isCaptured = false // auto-release on up
      onPointerUp(createNormalizedEvent(e))
    })
  }

  // pointer move - fires for all moves when captured, otherwise only in bounds
  if (onPointerMove) {
    viewProps.onTouchMove = composeEventHandlers(viewProps.onTouchMove, (e: any) => {
      const { locationX, locationY } = e.nativeEvent
      const { width, height } = bag.layout
      const isInBounds =
        locationX >= 0 && locationX <= width && locationY >= 0 && locationY <= height

      // fire if captured OR in bounds (matches web behavior)
      if (bag.isCaptured || isInBounds) {
        onPointerMove(createNormalizedEvent(e))
      }
    })
  }

  // pointer cancel
  if (onPointerCancel) {
    viewProps.onTouchCancel = composeEventHandlers(viewProps.onTouchCancel, (e: any) => {
      bag.isCaptured = false
      onPointerCancel(createNormalizedEvent(e))
    })
  }

  // enter/leave and layout tracking
  if (onPointerEnter || onPointerLeave || onPointerMove) {
    // track layout for bounds checking
    viewProps.onLayout = composeEventHandlers(viewProps.onLayout, (e: any) => {
      bag.layout = {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      }
    })
  }

  // enter on touch start if in bounds
  if (onPointerEnter) {
    viewProps.onTouchStart = composeEventHandlers(viewProps.onTouchStart, (e: any) => {
      const { locationX, locationY } = e.nativeEvent
      const { width, height } = bag.layout
      if (locationX >= 0 && locationX <= width && locationY >= 0 && locationY <= height) {
        bag.isInside = true
        onPointerEnter(createNormalizedEvent(e))
      }
    })
  }

  // leave when touch moves outside or ends
  if (onPointerLeave) {
    viewProps.onTouchMove = composeEventHandlers(viewProps.onTouchMove, (e: any) => {
      const { locationX, locationY } = e.nativeEvent
      const { width, height } = bag.layout
      const isInside =
        locationX >= 0 && locationX <= width && locationY >= 0 && locationY <= height
      if (bag.isInside && !isInside) {
        bag.isInside = false
        onPointerLeave(createNormalizedEvent(e))
      }
    })

    viewProps.onTouchEnd = composeEventHandlers(viewProps.onTouchEnd, (e: any) => {
      if (bag.isInside) {
        bag.isInside = false
        onPointerLeave(createNormalizedEvent(e))
      }
    })
  }
}
