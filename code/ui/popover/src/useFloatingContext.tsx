import React from 'react'
import type { Delay, UseFloatingOptions } from '@tamagui/floating'
import {
  createFloatingEvents,
  safePolygon,
  useDelayGroup,
  useFloatingRaw,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  PopupTriggerMap,
  type FloatingInteractionContext,
} from '@tamagui/floating'

// custom floating context for hoverable popovers and tooltips.
//
// why we can't just use useHover alone:
//   useHover attaches mouseenter/mouseleave via useEffect on the current
//   reference element. in multi-trigger mode, PopperAnchor switches the
//   reference when the cursor enters a new trigger — but useEffect hasn't
//   re-run yet, so the new trigger's mouseenter is missed by useHover.
//   we handle opens ourselves via onHoverReference; useHover + safePolygon
//   handle close detection.
//
// multi-trigger gap handling:
//   when sweeping between triggers, the cursor exits safePolygon's triangle
//   (which points toward content, not sideways). we use a short grace period
//   to block safePolygon's close during the gap. if a new trigger is entered,
//   we cancel the pending close. if not, the grace timer fires it.

export type UseFloatingContextOptions = {
  open: boolean
  setOpen: (val: boolean, type?: string) => void
  disable?: boolean
  disableFocus?: boolean
  hoverable?: boolean | Record<string, any>
  // defaults to 'dialog', tooltips pass 'tooltip'
  role?: 'dialog' | 'tooltip'
  // custom focus config (tooltip passes { enabled, visibleOnly })
  focus?: Record<string, any>
  // delay group coordination for tooltips
  groupId?: string
  // explicit delay override (tooltip computes this from delay group context)
  delay?: Delay
  // explicit restMs override
  restMs?: number
}

export const useFloatingContext = ({
  open,
  setOpen,
  disable,
  disableFocus,
  hoverable,
  role: roleProp = 'dialog',
  focus: focusProp,
  groupId,
  delay: delayProp,
  restMs: restMsProp,
}: UseFloatingContextOptions) => {
  'use no memo'

  const openRef = React.useRef(open)
  openRef.current = open
  const hoverableRef = React.useRef(hoverable)
  hoverableRef.current = hoverable
  const disableRef = React.useRef(disable)
  disableRef.current = disable
  const disableFocusRef = React.useRef(disableFocus)
  disableFocusRef.current = disableFocus
  const roleRef = React.useRef(roleProp)
  roleRef.current = roleProp
  const focusRef = React.useRef(focusProp)
  focusRef.current = focusProp
  const groupIdRef = React.useRef(groupId)
  groupIdRef.current = groupId
  const delayRef = React.useRef(delayProp)
  delayRef.current = delayProp
  const restMsRef = React.useRef(restMsProp)
  restMsRef.current = restMsProp

  const events = React.useMemo(() => createFloatingEvents(), [])
  const triggerElements = React.useMemo(() => new PopupTriggerMap(), [])

  React.useEffect(() => {
    events.emit('openchange', { open })
  }, [open, events])

  return React.useCallback(
    (props: UseFloatingOptions) => {
      const onTriggerRef = React.useRef(false)
      const restTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
      const graceRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
      const pendingCloseRef = React.useRef(false)

      React.useEffect(() => {
        return () => {
          clearTimeout(restTimerRef.current)
          clearTimeout(graceRef.current)
        }
      }, [])

      const onOpenChange = (val: boolean, event?: Event) => {
        // block useHover's mouseenter opens — we handle open timing via onHoverReference
        if (val && event?.type === 'mouseenter') {
          return
        }
        // during trigger grace period, block safePolygon closes but remember them
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
      }

      // pass open so floating-ui resets isPositioned on close — without this,
      // isPositioned stays true and the animation driver slides from old position
      const floating = useFloatingRaw({ ...props, open: openRef.current }) as any
      const currentHoverable = hoverableRef.current

      const dataRef = React.useRef<{ openEvent?: Event; placement?: string }>({})
      dataRef.current.placement = floating.placement

      const interactionContext: FloatingInteractionContext = {
        open: openRef.current,
        onOpenChange,
        refs: {
          reference: floating.refs?.reference || { current: null },
          floating: floating.refs?.floating || { current: null },
          domReference: floating.refs?.reference || { current: null },
        },
        elements: {
          reference: floating.refs?.reference?.current || null,
          floating: floating.refs?.floating?.current || null,
          domReference: floating.refs?.reference?.current || null,
        },
        dataRef,
        events,
        triggerElements,
      }

      // delay group coordination — no-op when no FloatingDelayGroup provider exists
      const { delay: groupDelay, currentId: groupCurrentId } = useDelayGroup(
        interactionContext,
        { id: groupIdRef.current }
      )

      // compute effective delay:
      // 1. if in an active delay group with another tooltip showing, use group's coordinated delay
      // 2. else use explicit delay prop if provided
      // 3. else parse from hoverable config
      const isInActiveGroup =
        groupIdRef.current && groupCurrentId != null && typeof groupDelay === 'object'
      let delay: Delay
      let restMs: number
      if (isInActiveGroup) {
        delay = groupDelay
        restMs = 0
      } else if (delayRef.current !== undefined) {
        delay = delayRef.current
        restMs = restMsRef.current ?? 0
      } else {
        delay =
          currentHoverable && typeof currentHoverable === 'object'
            ? (currentHoverable.delay ?? 0)
            : 0
        restMs =
          currentHoverable && typeof currentHoverable === 'object'
            ? (currentHoverable.restMs ?? 0)
            : 0
      }

      const currentRole = roleRef.current
      const currentFocus = focusRef.current

      const { getReferenceProps, getFloatingProps } = useInteractions([
        currentHoverable
          ? useHover(interactionContext, {
              enabled: !disableRef.current && !!currentHoverable,
              delay,
              restMs,
              handleClose: safePolygon({
                requireIntent: true,
                buffer: 1,
                __debug:
                  typeof window !== 'undefined' &&
                  new URLSearchParams(window.location.search).get('debug') ===
                    'safePolygon',
              }),
              ...(typeof currentHoverable === 'object' && currentHoverable),
            })
          : useHover(interactionContext, {
              enabled: false,
            }),
        useFocus(interactionContext, {
          enabled: !disableRef.current && !disableFocusRef.current,
          visibleOnly: true,
          ...currentFocus,
        }),
        useRole(interactionContext, { role: currentRole }),
      ])

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
        triggerElements,
        getReferenceProps,
        getFloatingProps: currentHoverable
          ? (props: any) => {
              const floatingProps = getFloatingProps(props)
              return {
                ...floatingProps,
                onMouseEnter: (e: any) => {
                  pendingCloseRef.current = false
                  floatingProps?.onMouseEnter?.(e)
                },
              }
            }
          : getFloatingProps,

        onHoverReference: currentHoverable
          ? (_event: any) => {
              clearTimeout(graceRef.current)
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
              clearTimeout(graceRef.current)
              graceRef.current = setTimeout(() => {
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
    [setOpen]
  )
}
