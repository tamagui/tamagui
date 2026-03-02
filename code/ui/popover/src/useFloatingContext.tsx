import React from 'react'
import type { UseFloatingOptions } from '@floating-ui/react'
import {
  safePolygon,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'

// custom floating context for hoverable popovers.
// uses floating-ui's useHover + safePolygon for close handling (geometric safe
// zone between trigger and content), but handles multi-trigger open/restMs
// ourselves via onHoverReference since useHover's listeners aren't attached
// when PopperAnchor switches the reference element mid-hover.
//
// multi-trigger gap handling: when the mouse leaves one trigger heading toward
// another, safePolygon may detect the mouse outside its safe zone and fire a
// close. we block this close during a short grace period (onTriggerRef), but
// remember it as a pending close. if the mouse reaches the next trigger,
// onHoverReference clears the pending close. if not (mouse went nowhere),
// the grace timer fires the pending close. this avoids safePolygon's one-shot
// problem (handler removes itself after firing) while keeping zero close events
// during trigger switching.

export const useFloatingContext = ({
  open,
  setOpen,
  disable,
  disableFocus,
  hoverable,
}) => {
  'use no memo'

  // use refs so the factory callback doesn't need these as deps.
  // without this, open changing (false→true) recreates the factory every time
  // the popover opens, causing downstream hook confusion.
  const openRef = React.useRef(open)
  openRef.current = open
  const hoverableRef = React.useRef(hoverable)
  hoverableRef.current = hoverable
  const disableRef = React.useRef(disable)
  disableRef.current = disable
  const disableFocusRef = React.useRef(disableFocus)
  disableFocusRef.current = disableFocus

  return React.useCallback(
    (props: UseFloatingOptions) => {
      // true while pointer is over a trigger element (with grace period on leave)
      const onTriggerRef = React.useRef(false)
      const restTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
      const triggerGraceRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
      // when safePolygon fires close during the grace period, we block it but
      // store it here. the grace timer checks this and fires the close if the
      // mouse didn't reach another trigger.
      const pendingCloseRef = React.useRef(false)

      React.useEffect(() => {
        return () => {
          clearTimeout(restTimerRef.current)
          clearTimeout(triggerGraceRef.current)
        }
      }, [])

      const floating = useFloating({
        ...props,
        open: openRef.current,
        onOpenChange: (val, event) => {
          // block floating-ui's useHover from opening on mouseenter — we
          // handle open timing ourselves via onHoverReference/setOpenWithDelay
          // to ensure restMs/delay work correctly across re-hovers and
          // multi-trigger switching.
          if (val && event?.type === 'mouseenter') {
            return
          }
          // during the trigger grace period, block hover-based closes but
          // remember them. safePolygon's handler removes itself after firing,
          // so we can't just "let it through later". instead we store the
          // pending close and fire it when the grace expires (if the mouse
          // didn't reach another trigger).
          if (
            !val &&
            onTriggerRef.current &&
            (event?.type === 'mousemove' || event?.type === 'mouseleave')
          ) {
            pendingCloseRef.current = true
            return
          }
          const type =
            event?.type === 'mousemove' ||
            event?.type === 'mouseenter' ||
            event?.type === 'mouseleave'
              ? 'hover'
              : 'press'
          setOpen(val, type)
        },
      }) as any

      const currentHoverable = hoverableRef.current

      const { getReferenceProps, getFloatingProps } = useInteractions([
        currentHoverable
          ? useHover(floating.context, {
              enabled: !disableRef.current && !!currentHoverable,
              handleClose: safePolygon({
                requireIntent: true,
                blockPointerEvents: false,
                buffer: 1,
              }),
              ...(typeof currentHoverable === 'object' && currentHoverable),
            })
          : useHover(floating.context, {
              enabled: false,
            }),
        useFocus(floating.context, {
          enabled: !disableRef.current && !disableFocusRef.current,
          visibleOnly: true,
        }),
        useRole(floating.context, { role: 'dialog' }),
      ])

      // parse hoverable config
      const delay =
        currentHoverable && typeof currentHoverable === 'object'
          ? currentHoverable.delay
          : 0
      const restMs =
        currentHoverable && typeof currentHoverable === 'object'
          ? currentHoverable.restMs
          : 0
      const openDelay = typeof delay === 'number' ? delay : ((delay as any)?.open ?? 0)

      const setOpenWithDelay = () => {
        clearTimeout(restTimerRef.current)
        if (restMs && !openDelay) {
          restTimerRef.current = setTimeout(() => {
            setOpen(true, 'hover')
          }, restMs)
        } else if (openDelay) {
          restTimerRef.current = setTimeout(() => {
            setOpen(true, 'hover')
          }, openDelay)
        } else {
          setOpen(true, 'hover')
        }
      }

      return {
        ...floating,
        open: openRef.current,
        getReferenceProps,
        getFloatingProps,

        // multi-trigger open: useHover attaches listeners via useEffect, so they
        // miss the initial mouseenter when PopperAnchor switches reference mid-hover.
        // we handle open ourselves here; useHover + safePolygon handle close.
        onHoverReference: currentHoverable
          ? (_event: any) => {
              clearTimeout(triggerGraceRef.current)
              onTriggerRef.current = true
              pendingCloseRef.current = false
              clearTimeout(restTimerRef.current)

              if (openRef.current) return
              setOpenWithDelay()
            }
          : undefined,

        onLeaveReference: currentHoverable
          ? () => {
              clearTimeout(restTimerRef.current)
              // grace period: keep onTriggerRef true briefly so safePolygon's
              // close is blocked during the gap between adjacent triggers.
              // if no trigger is entered before grace expires, fire any
              // pending close that safePolygon requested.
              clearTimeout(triggerGraceRef.current)
              triggerGraceRef.current = setTimeout(() => {
                onTriggerRef.current = false
                if (pendingCloseRef.current) {
                  pendingCloseRef.current = false
                  setOpen(false, 'hover')
                }
              }, 40)
            }
          : undefined,
      }
    },
    // factory is stable - open/hoverable/disable/disableFocus accessed via refs
    [setOpen]
  )
}
