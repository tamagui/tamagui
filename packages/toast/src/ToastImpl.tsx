import { useIsPresent } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  TamaguiElement,
  composeEventHandlers,
  isWeb,
  styled,
  useEvent,
} from '@tamagui/core'
import {
  Dismissable,
  DismissableProps,
  dispatchDiscreteCustomEvent,
} from '@tamagui/dismissable'
import { PortalItem } from '@tamagui/portal'
import { ThemeableStack } from '@tamagui/stacks'
import * as React from 'react'
import { PointerEvent } from 'react-native'

import { ToastAnnounce } from './Announce'
import {
  TOAST_NAME,
  TOAST_SWIPE_CANCEL,
  TOAST_SWIPE_END,
  TOAST_SWIPE_MOVE,
  TOAST_SWIPE_START,
} from './constants'
import {
  Collection,
  ScopedProps,
  SwipeDirection,
  createToastContext,
  useToastProviderContext,
} from './Provider'
import { VIEWPORT_PAUSE, VIEWPORT_RESUME } from './Viewport'

const ToastImplFrame = styled(ThemeableStack, {
  name: 'ToastImpl',
  //   x: 'var(--toast-swipe-move-x)',
  //   y: 'var(--toast-swipe-move-y)',
  variants: {
    backgrounded: {
      true: {
        backgroundColor: '$color6',
      },
    },
    unstyled: {
      false: {
        borderRadius: '$10',
        paddingHorizontal: '$5',
        paddingVertical: '$2',
        marginHorizontal: "auto",
        marginVertical: '$1',
      },
    },
  },
  defaultVariants: {
    backgrounded: true,
    unstyled: false,
  },
})
interface ToastProps extends Omit<ToastImplProps, keyof ToastImplPrivateProps> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
  /**
   * Used to reference a specific viewport if you're using multiple ones.
   */
  viewportName?: string
}

type SwipeEvent = { currentTarget: EventTarget & TamaguiElement } & Omit<
  CustomEvent<{ originalEvent: React.PointerEvent; delta: { x: number; y: number } }>,
  'currentTarget'
>

const [ToastInteractiveProvider, useToastInteractiveContext] = createToastContext(
  TOAST_NAME,
  {
    onClose() {},
  }
)

type ToastImplPrivateProps = { open: boolean; onClose(): void }
type ToastImplFrameProps = GetProps<typeof ToastImplFrame>
type ToastImplProps = ToastImplPrivateProps &
  ToastImplFrameProps & {
    type?: 'foreground' | 'background'
    /**
     * Time in milliseconds that toast should remain visible for. Overrides value
     * given to `ToastProvider`.
     */
    duration?: number
    onEscapeKeyDown?: DismissableProps['onEscapeKeyDown']
    onPause?(): void
    onResume?(): void
    onSwipeStart?(event: SwipeEvent): void
    onSwipeMove?(event: SwipeEvent): void
    onSwipeCancel?(event: SwipeEvent): void
    onSwipeEnd?(event: SwipeEvent): void
    viewportName?: string
  }

const ToastImpl = React.forwardRef<TamaguiElement, ToastImplProps>(
  (props: ScopedProps<ToastImplProps>, forwardedRef) => {
    const {
      __scopeToast,
      type = 'foreground',
      duration: durationProp,
      open,
      onClose,
      onEscapeKeyDown,
      onPause,
      onResume,
      onSwipeStart,
      onSwipeMove,
      onSwipeCancel,
      onSwipeEnd,
      viewportName,
      ...toastProps
    } = props
    const isPresent = useIsPresent()
    const context = useToastProviderContext(TOAST_NAME, __scopeToast)
    const [node, setNode] = React.useState<TamaguiElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node) => setNode(node))
    const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
    const swipeDeltaRef = React.useRef<{ x: number; y: number } | null>(null)
    const duration = durationProp || context.duration
    const closeTimerStartTimeRef = React.useRef(0)
    const closeTimerRemainingTimeRef = React.useRef(duration)
    const closeTimerRef = React.useRef(0)
    const { onToastAdd, onToastRemove } = context
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const handleClose = useEvent(() => {
      if (!isPresent) {
        // already removed from the react tree
        return
      }
      // focus viewport if focus is within toast to read the remaining toast
      // count to SR users and ensure focus isn't lost
      if (isWeb) {
        const isFocusInToast = (node as HTMLDivElement)?.contains(document.activeElement)
        if (isFocusInToast) context.viewport?.focus()
      }
      onClose()
    })

    const startTimer = React.useCallback(
      (duration: number) => {
        if (!duration || duration === Infinity) return
        clearTimeout(closeTimerRef.current)
        closeTimerStartTimeRef.current = new Date().getTime()
        closeTimerRef.current = setTimeout(handleClose, duration) as unknown as number
      },
      [handleClose]
    )

    React.useEffect(() => {
      if (!isWeb) return
      const viewport = context.viewport as HTMLElement
      if (viewport) {
        const handleResume = () => {
          startTimer(closeTimerRemainingTimeRef.current)
          onResume?.()
        }
        const handlePause = () => {
          const elapsedTime = new Date().getTime() - closeTimerStartTimeRef.current
          closeTimerRemainingTimeRef.current =
            closeTimerRemainingTimeRef.current - elapsedTime
          window.clearTimeout(closeTimerRef.current)
          onPause?.()
        }
        viewport.addEventListener(VIEWPORT_PAUSE, handlePause)
        viewport.addEventListener(VIEWPORT_RESUME, handleResume)
        return () => {
          viewport.removeEventListener(VIEWPORT_PAUSE, handlePause)
          viewport.removeEventListener(VIEWPORT_RESUME, handleResume)
        }
      }
    }, [context.viewport, duration, onPause, onResume, startTimer])

    // start timer when toast opens or duration changes.
    // we include `open` in deps because closed !== unmounted when animating
    // so it could reopen before being completely unmounted
    React.useEffect(() => {
      if (open && !context.isClosePausedRef.current) {
        startTimer(duration)
      }
    }, [open, duration, context.isClosePausedRef, startTimer])

    React.useEffect(() => {
      onToastAdd()
      return () => onToastRemove()
    }, [onToastAdd, onToastRemove])

    const announceTextContent = React.useMemo(() => {
      if (!isWeb) return null
      return node ? getAnnounceTextContent(node as HTMLDivElement) : null
    }, [node])

    // writing this logic in here since the frame doesn't seem to care about onPointerMove
    const handlePointerMove = React.useCallback(
      (event: globalThis.PointerEvent) => {
        if (!pointerStartRef.current) return
        const x = event.clientX - pointerStartRef.current.x
        const y = event.clientY - pointerStartRef.current.y
        const hasSwipeMoveStarted = Boolean(swipeDeltaRef.current)
        const isHorizontalSwipe = ['left', 'right'].includes(context.swipeDirection)
        const clamp = ['left', 'up'].includes(context.swipeDirection)
          ? Math.min
          : Math.max
        const clampedX = isHorizontalSwipe ? clamp(0, x) : 0
        const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0
        const moveStartBuffer = event.pointerType === 'touch' ? 10 : 2
        const delta = { x: clampedX, y: clampedY }
        const eventDetail = { originalEvent: event, delta }
        if (hasSwipeMoveStarted) {
          swipeDeltaRef.current = delta
          setPosition(delta)
          handleAndDispatchCustomEvent(TOAST_SWIPE_MOVE, onSwipeMove, eventDetail, {
            discrete: false,
          })
        } else if (isDeltaInDirection(delta, context.swipeDirection, moveStartBuffer)) {
          swipeDeltaRef.current = delta
          handleAndDispatchCustomEvent(TOAST_SWIPE_START, onSwipeStart, eventDetail, {
            discrete: false,
          })
          ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
        } else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) {
          // User is swiping in wrong direction so we disable swipe gesture
          // for the current pointer down interaction
          pointerStartRef.current = null
        }
      },
      [context.swipeDirection]
    )
    React.useEffect(() => {
      if (!isWeb) return

      const htmlNode = node as HTMLElement | null
      htmlNode?.addEventListener('pointermove', handlePointerMove)
      return () => htmlNode?.removeEventListener('pointermove', handlePointerMove)
    }, [node])

    // if (!context.viewport) return null
    return (
      <>
        {announceTextContent && (
          <ToastAnnounce
            __scopeToast={__scopeToast}
            // Toasts are always role=status to avoid stuttering issues with role=alert in SRs.
            role="status"
            aria-live={type === 'foreground' ? 'assertive' : 'polite'}
            aria-atomic
          >
            {announceTextContent}
          </ToastAnnounce>
        )}

        <ToastInteractiveProvider
          scope={__scopeToast}
          onClose={() => {
            handleClose()
          }}
        >
          <PortalItem hostName={viewportName ?? 'default'} key={props.id}>
            <Collection.ItemSlot key={props.id} scope={__scopeToast}>
              <Dismissable
                // asChild
                onEscapeKeyDown={composeEventHandlers(onEscapeKeyDown, () => {
                  if (!context.isFocusedToastEscapeKeyDownRef.current) {
                    handleClose()
                  }
                  context.isFocusedToastEscapeKeyDownRef.current = false
                })}
              >
                <ToastImplFrame
                  // Ensure toasts are announced as status list or status when focused
                  role="status"
                  aria-live="off"
                  aria-atomic
                  tabIndex={0}
                  data-state={open ? 'open' : 'closed'}
                  data-swipe-direction={context.swipeDirection}
                  pointerEvents="auto"
                  //   touchAction="none"
                  userSelect="none"
                  {...toastProps}
                  ref={composedRefs}
                  {...(isWeb && {
                    onKeyDown: composeEventHandlers(
                      (props as any).onKeyDown,
                      (event: KeyboardEvent) => {
                        if (event.key !== 'Escape') return
                        onEscapeKeyDown?.(event)
                        onEscapeKeyDown?.(event)
                        if (!event.defaultPrevented) {
                          context.isFocusedToastEscapeKeyDownRef.current = true
                          handleClose()
                        }
                      }
                    ),
                  })}
                  onPressIn={composeEventHandlers(
                    props.onPressIn ?? undefined,
                    (event) => {
                      if (isWeb) {
                        const webEvent = event as unknown as React.MouseEvent
                        if (webEvent.button !== 0) return
                        pointerStartRef.current = {
                          x: webEvent.clientX,
                          y: webEvent.clientY,
                        }
                      } else {
                        pointerStartRef.current = {
                          x: event.nativeEvent.locationX,
                          y: event.nativeEvent.locationY,
                        }
                      }
                    }
                  )}
                  // onPointerMove={handlePointerMove}
                  onPressOut={composeEventHandlers(
                    props.onPressOut ?? undefined,
                    (event) => {
                      const delta = swipeDeltaRef.current
                      if (isWeb) {
                        const target = event.target as unknown as HTMLElement

                        // if (target.hasPointerCapture(event.pointerId)) {
                        //   target.releasePointerCapture(event.pointerId)
                        // }
                        swipeDeltaRef.current = null
                        pointerStartRef.current = null
                        if (delta) {
                          const toast = event.currentTarget
                          const eventDetail = { originalEvent: event, delta }
                          if (
                            isDeltaInDirection(
                              delta,
                              context.swipeDirection,
                              context.swipeThreshold
                            )
                          ) {
                            handleAndDispatchCustomEvent(
                              TOAST_SWIPE_END,
                              onSwipeEnd,
                              eventDetail,
                              {
                                discrete: true,
                              }
                            )
                          } else {
                            handleAndDispatchCustomEvent(
                              TOAST_SWIPE_CANCEL,
                              onSwipeCancel,
                              eventDetail,
                              {
                                discrete: true,
                              }
                            )
                          }
                          // Prevent click event from triggering on items within the toast when
                          // pointer up is part of a swipe gesture
                          toast.addEventListener(
                            'click',
                            (event) => event.preventDefault(),
                            {
                              once: true,
                            }
                          )
                        }
                      }
                    }
                  )}
                />
              </Dismissable>
            </Collection.ItemSlot>
          </PortalItem>
        </ToastInteractiveProvider>
      </>
    )
  }
)

ToastImpl.propTypes = {
  type(props) {
    if (props.type && !['foreground', 'background'].includes(props.type)) {
      const error = `Invalid prop \`type\` supplied to \`${TOAST_NAME}\`. Expected \`foreground | background\`.`
      return new Error(error)
    }
    return null
  },
}

/* ---------------------------------------------------------------------------------------------- */

function handleAndDispatchCustomEvent<
  E extends CustomEvent,
  ReactEvent extends React.SyntheticEvent
>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: { originalEvent: ReactEvent } & (E extends CustomEvent<infer D> ? D : never),
  { discrete }: { discrete: boolean }
) {
  const currentTarget = detail.originalEvent.currentTarget as HTMLElement
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail })
  if (handler)
    currentTarget.addEventListener(name, handler as EventListener, { once: true })

  if (discrete) {
    dispatchDiscreteCustomEvent(currentTarget, event)
  } else {
    currentTarget.dispatchEvent(event)
  }
}

const isDeltaInDirection = (
  delta: { x: number; y: number },
  direction: SwipeDirection,
  threshold = 0
) => {
  const deltaX = Math.abs(delta.x)
  const deltaY = Math.abs(delta.y)
  const isDeltaX = deltaX > deltaY
  if (direction === 'left' || direction === 'right') {
    return isDeltaX && deltaX > threshold
  } else {
    return !isDeltaX && deltaY > threshold
  }
}

function getAnnounceTextContent(container: HTMLElement) {
  if (!isWeb) return ''
  const textContent: string[] = []
  const childNodes = Array.from(container.childNodes)

  childNodes.forEach((node) => {
    if (node.nodeType === node.TEXT_NODE && node.textContent)
      textContent.push(node.textContent)
    if (isHTMLElement(node)) {
      const isHidden = node.ariaHidden || node.hidden || node.style.display === 'none'
      const isExcluded = node.dataset.toastAnnounceExclude === ''

      if (!isHidden) {
        if (isExcluded) {
          const altText = node.dataset.toastAnnounceAlt
          if (altText) textContent.push(altText)
        } else {
          textContent.push(...getAnnounceTextContent(node))
        }
      }
    }
  })

  // We return a collection of text rather than a single concatenated string.
  // This allows SR VO to naturally pause break between nodes while announcing.
  return textContent
}

function isHTMLElement(node: any): node is HTMLElement {
  return node.nodeType === node.ELEMENT_NODE
}

export { ToastImpl, ToastImplFrame, ToastImplProps, useToastInteractiveContext }
export type { ToastProps }
