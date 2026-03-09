import * as React from 'react'
import { useEvent } from '@tamagui/use-event'

import type {
  Delay,
  ElementProps,
  FloatingInteractionContext,
  OpenChangeReason,
  UseHoverProps,
} from './types'
import {
  clearTimeoutIfSet,
  contains,
  getDocument,
  isElement,
  isMouseLikePointerType,
} from './utils'

const safePolygonIdentifier = 'data-floating-ui-safe-polygon'

export function getDelay(
  value: Delay | undefined,
  prop: 'open' | 'close',
  pointerType?: string
) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0
  }

  if (typeof value === 'number') {
    return value
  }

  return value?.[prop]
}

export interface UseHoverReturn extends ElementProps {}

// hover interaction hook ported from @floating-ui/react.
// uses raw DOM addEventListener on the reference element (NOT react delegation)
// so that mouseenter fires even when cursor moves from a disabled element.
//
// intentionally does NOT listen for documentElement mouseleave, which
// fixes the window-blur-closing-popover bug from @floating-ui/react.
export function useHover(
  context: FloatingInteractionContext,
  props: UseHoverProps = {}
): ElementProps {
  const { open, onOpenChange, dataRef, events, elements } = context
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true,
  } = props

  // latest-value refs to avoid stale closures in raw DOM handlers
  const handleCloseRef = React.useRef(handleClose)
  handleCloseRef.current = handleClose
  const delayRef = React.useRef(delay)
  delayRef.current = delay
  const openRef = React.useRef(open)
  openRef.current = open
  const restMsRef = React.useRef(restMs)
  restMsRef.current = restMs
  // stable callback that always calls the latest onOpenChange
  const stableOnOpenChange = useEvent(onOpenChange)

  const pointerTypeRef = React.useRef<string | undefined>(undefined)
  const timeoutRef = React.useRef(-1)
  const handlerRef = React.useRef<((event: MouseEvent) => void) | undefined>(undefined)
  const restTimeoutRef = React.useRef(-1)
  const blockMouseMoveRef = React.useRef(true)
  const performedPointerEventsMutationRef = React.useRef(false)
  const unbindMouseMoveRef = React.useRef(() => {})
  const restTimeoutPendingRef = React.useRef(false)

  const isHoverOpen = useEvent(() => {
    const type = dataRef.current.openEvent?.type
    return type?.includes('mouse') && type !== 'mousedown'
  })

  // when closing before opening, clear the delay timeouts to cancel it
  // from showing.
  React.useEffect(() => {
    if (!enabled) return
    if (!events) return

    function onOpenChange({ open }: { open: boolean }) {
      if (!open) {
        clearTimeoutIfSet(timeoutRef)
        clearTimeoutIfSet(restTimeoutRef)
        blockMouseMoveRef.current = true
        restTimeoutPendingRef.current = false
      }
    }

    events.on('openchange', onOpenChange)
    return () => {
      events.off('openchange', onOpenChange)
    }
  }, [enabled, events])

  // NOTE: intentionally skipping the documentElement mouseleave handler
  // from upstream. this is our fix for the window-blur-closing-popover bug.

  const closeWithDelay = useEvent(
    (event: Event, runElseBranch = true, reason: OpenChangeReason = 'hover') => {
      const closeDelay = getDelay(delayRef.current, 'close', pointerTypeRef.current)
      if (closeDelay && !handlerRef.current) {
        clearTimeoutIfSet(timeoutRef)
        timeoutRef.current = window.setTimeout(
          () => stableOnOpenChange(false, event, reason),
          closeDelay
        ) as unknown as number
      } else if (runElseBranch) {
        clearTimeoutIfSet(timeoutRef)
        stableOnOpenChange(false, event, reason)
      }
    }
  )

  const cleanupMouseMoveHandler = useEvent(() => {
    unbindMouseMoveRef.current()
    handlerRef.current = undefined
    if (context.handleCloseActiveRef) {
      context.handleCloseActiveRef.current = false
    }
  })

  const clearPointerEvents = useEvent(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(elements.floating).body
      body.style.pointerEvents = ''
      body.removeAttribute(safePolygonIdentifier)
      performedPointerEventsMutationRef.current = false
    }
  })

  const isClickLikeOpenEvent = useEvent(() => {
    return dataRef.current.openEvent
      ? ['click', 'mousedown'].includes(dataRef.current.openEvent.type)
      : false
  })

  // registering the mouse events on the reference directly to bypass React's
  // delegation system. if the cursor was on a disabled element and then entered
  // the reference (no gap), mouseenter doesn't fire in the delegation system.
  React.useEffect(() => {
    if (!enabled) return

    function onReferenceMouseEnter(event: MouseEvent) {
      clearTimeoutIfSet(timeoutRef)
      blockMouseMoveRef.current = false

      if (
        (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) ||
        (restMsRef.current > 0 && !getDelay(delayRef.current, 'open'))
      ) {
        return
      }

      const openDelay = getDelay(delayRef.current, 'open', pointerTypeRef.current)

      if (openDelay) {
        timeoutRef.current = window.setTimeout(() => {
          if (!openRef.current) {
            stableOnOpenChange(true, event, 'hover')
          }
        }, openDelay) as unknown as number
      } else if (!open) {
        stableOnOpenChange(true, event, 'hover')
      }
    }

    function onReferenceMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) {
        clearPointerEvents()
        return
      }

      // moving to a sibling trigger in a multi-trigger pattern — suppress close
      if (context.triggerElements?.hasElement(event.relatedTarget as Element)) {
        return
      }

      unbindMouseMoveRef.current()

      const doc = getDocument(elements.floating)
      clearTimeoutIfSet(restTimeoutRef)
      restTimeoutPendingRef.current = false

      if (handleCloseRef.current) {
        // prevent clearing onScrollMouseLeave timeout
        if (!open) {
          clearTimeoutIfSet(timeoutRef)
        }

        const placement = dataRef.current.placement || 'bottom'
        const reference = elements.domReference
        const floating = elements.floating

        if (!reference || !floating) return

        // call handleClose once with the leave position — it returns a
        // mousemove handler with the leave (x, y) baked into its closure
        // so the polygon anchor stays fixed at the leave point.
        handlerRef.current = handleCloseRef.current({
          x: event.clientX,
          y: event.clientY,
          placement,
          elements: {
            reference: reference as Element,
            floating: floating as HTMLElement,
            domReference: reference as Element,
          },
          onClose() {
            if (context.handleCloseActiveRef) {
              context.handleCloseActiveRef.current = false
            }
            clearPointerEvents()
            cleanupMouseMoveHandler()
            if (!isClickLikeOpenEvent()) {
              closeWithDelay(event, true, 'safe-polygon')
            }
          },
        })

        if (context.handleCloseActiveRef) {
          context.handleCloseActiveRef.current = true
        }

        const handler = handlerRef.current

        doc.addEventListener('mousemove', handler)
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener('mousemove', handler)
        }

        return
      }

      // allow interactivity without safePolygon on touch devices. with a
      // pointer, a short close delay is an alternative.
      const shouldClose =
        pointerTypeRef.current === 'touch'
          ? !contains(elements.floating, event.relatedTarget as Element | null)
          : true
      if (shouldClose) {
        closeWithDelay(event)
      }
    }

    // ensure the floating element closes after scrolling even if the pointer
    // did not move.
    function onScrollMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) return

      // moving to a sibling trigger in a multi-trigger pattern — suppress close
      if (context.triggerElements?.hasElement(event.relatedTarget as Element)) {
        return
      }

      const placement = dataRef.current.placement || 'bottom'
      const reference = elements.domReference
      const floating = elements.floating

      if (!reference || !floating) return

      // call handleClose to get a handler, then immediately invoke it
      // with this scroll-leave event
      handleCloseRef.current?.({
        x: event.clientX,
        y: event.clientY,
        placement,
        elements: {
          reference: reference as Element,
          floating: floating as HTMLElement,
          domReference: reference as Element,
        },
        onClose() {
          clearPointerEvents()
          cleanupMouseMoveHandler()
          if (!isClickLikeOpenEvent()) {
            closeWithDelay(event)
          }
        },
      })(event)
    }

    function onFloatingMouseEnter() {
      clearTimeoutIfSet(timeoutRef)
    }

    function onFloatingMouseLeave(event: MouseEvent) {
      if (isClickLikeOpenEvent()) return

      // moving to a sibling trigger in a multi-trigger pattern — suppress close
      if (context.triggerElements?.hasElement(event.relatedTarget as Element)) {
        return
      }

      closeWithDelay(event, false)
    }

    if (isElement(elements.domReference)) {
      const reference = elements.domReference as unknown as HTMLElement
      const floating = elements.floating

      if (open) {
        reference.addEventListener('mouseleave', onScrollMouseLeave)
      }

      if (move) {
        reference.addEventListener('mousemove', onReferenceMouseEnter, {
          once: true,
        })
      }

      reference.addEventListener('mouseenter', onReferenceMouseEnter)
      reference.addEventListener('mouseleave', onReferenceMouseLeave)

      if (floating) {
        floating.addEventListener('mouseleave', onScrollMouseLeave)
        floating.addEventListener('mouseenter', onFloatingMouseEnter)
        floating.addEventListener('mouseleave', onFloatingMouseLeave)
      }

      return () => {
        if (open) {
          reference.removeEventListener('mouseleave', onScrollMouseLeave)
        }

        if (move) {
          reference.removeEventListener('mousemove', onReferenceMouseEnter)
        }

        reference.removeEventListener('mouseenter', onReferenceMouseEnter)
        reference.removeEventListener('mouseleave', onReferenceMouseLeave)

        if (floating) {
          floating.removeEventListener('mouseleave', onScrollMouseLeave)
          floating.removeEventListener('mouseenter', onFloatingMouseEnter)
          floating.removeEventListener('mouseleave', onFloatingMouseLeave)
        }

        // clean up safePolygon's document mousemove handler when reference
        // changes — without this, handleCloseActiveRef stays true
        // indefinitely after rapid trigger switching
        cleanupMouseMoveHandler()
      }
    }
  }, [elements, enabled, context, mouseOnly, move, open, dataRef])

  // block pointer-events of every element other than the reference and floating
  // while the floating element is open and has a handleClose handler with
  // blockPointerEvents enabled.
  React.useLayoutEffect(() => {
    if (!enabled) return

    if (open && handleCloseRef.current?.__options?.blockPointerEvents && isHoverOpen()) {
      performedPointerEventsMutationRef.current = true
      const floatingEl = elements.floating

      if (isElement(elements.domReference) && floatingEl) {
        const body = getDocument(elements.floating).body
        body.setAttribute(safePolygonIdentifier, '')

        const ref = elements.domReference as unknown as HTMLElement | SVGSVGElement

        body.style.pointerEvents = 'none'
        ref.style.pointerEvents = 'auto'
        floatingEl.style.pointerEvents = 'auto'

        return () => {
          body.style.pointerEvents = ''
          ref.style.pointerEvents = ''
          floatingEl.style.pointerEvents = ''
        }
      }
    }
  }, [enabled, open, elements, isHoverOpen])

  React.useLayoutEffect(() => {
    if (!open) {
      pointerTypeRef.current = undefined
      restTimeoutPendingRef.current = false
      cleanupMouseMoveHandler()
      clearPointerEvents()
    }
  }, [open])

  React.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler()
      clearTimeoutIfSet(timeoutRef)
      clearTimeoutIfSet(restTimeoutRef)
      clearPointerEvents()
    }
  }, [enabled, elements.domReference])

  const reference: ElementProps['reference'] = React.useMemo(() => {
    function setPointerRef(event: React.PointerEvent) {
      pointerTypeRef.current = event.pointerType
    }

    return {
      onPointerDown: setPointerRef,
      onPointerEnter: setPointerRef,
      onMouseMove(event: React.MouseEvent) {
        const { nativeEvent } = event

        function handleMouseMove() {
          if (!blockMouseMoveRef.current && !openRef.current) {
            stableOnOpenChange(true, nativeEvent, 'hover')
          }
        }

        if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) {
          return
        }

        if (open || restMsRef.current === 0) {
          return
        }

        // ignore insignificant movements to account for tremors
        if (
          restTimeoutPendingRef.current &&
          event.movementX ** 2 + event.movementY ** 2 < 2
        ) {
          return
        }

        clearTimeoutIfSet(restTimeoutRef)

        if (pointerTypeRef.current === 'touch') {
          handleMouseMove()
        } else {
          restTimeoutPendingRef.current = true
          restTimeoutRef.current = window.setTimeout(
            handleMouseMove,
            restMsRef.current
          ) as unknown as number
        }
      },
    }
  }, [mouseOnly, open])

  return React.useMemo(() => (enabled ? { reference } : {}), [enabled, reference])
}
