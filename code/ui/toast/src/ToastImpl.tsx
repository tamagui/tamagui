import { useIsPresent } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { GetProps, TamaguiElement } from '@tamagui/core'
import {
  Stack,
  Theme,
  createStyledContext,
  styled,
  useConfiguration,
  useEvent,
  useThemeName,
} from '@tamagui/core'
import type { DismissableProps } from '@tamagui/dismissable'
import { Dismissable } from '@tamagui/dismissable'
import { composeEventHandlers } from '@tamagui/helpers'
import { PortalItem } from '@tamagui/portal'
import { ThemeableStack } from '@tamagui/stacks'
import * as React from 'react'
import type {
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native'
import { PanResponder } from 'react-native'

import { TOAST_CONTEXT, TOAST_NAME } from './constants'
import { ToastAnnounce } from './ToastAnnounce'
import type { ScopedProps, SwipeDirection } from './ToastProvider'
import { Collection, useToastProviderContext } from './ToastProvider'
import { VIEWPORT_PAUSE, VIEWPORT_RESUME } from './ToastViewport'

const ToastImplFrame = styled(ThemeableStack, {
  name: 'ToastImpl',
  focusable: true,

  variants: {
    unstyled: {
      false: {
        focusStyle: {
          outlineStyle: 'solid',
          outlineWidth: 2,
          outlineColor: '$outlineColor',
        },
        backgroundColor: '$color6',
        borderRadius: '$10',
        paddingHorizontal: '$5',
        paddingVertical: '$2',
        marginHorizontal: 'auto',
        marginVertical: '$1',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

type ToastProps = Omit<ToastImplProps, keyof ToastImplPrivateProps>

type SwipeEvent = GestureResponderEvent

const {
  Provider: ToastInteractiveProvider,
  useStyledContext: useToastInteractiveContext,
} = createStyledContext({
  onClose() {},
})

type ToastImplPrivateProps = {
  open?: boolean
  onClose(): void
}

type ToastImplFrameProps = GetProps<typeof ToastImplFrame>

export type ToastExtraProps = {
  /**
   * The controlled open state of the dialog. Must be used in conjunction with `onOpenChange`.
   */
  open?: boolean

  /**
   * The open state of the dialog when it is initially rendered. Use when you do not need to control its open state.
   */
  defaultOpen?: boolean
  /**
   * Event handler called when the open state of the dialog changes.
   */
  onOpenChange?(open: boolean): void
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true

  /**
   * Control the sensitivity of the toast for accessibility purposes.
   * For toasts that are the result of a user action, choose foreground. Toasts generated from background tasks should use background.
   */
  type?: 'foreground' | 'background'
  /**
   * Time in milliseconds that toast should remain visible for. Overrides value given to `ToastProvider`.
   */
  duration?: number
  /**
   * Event handler called when the escape key is down. It can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: DismissableProps['onEscapeKeyDown']
  /**
   * Event handler called when the dismiss timer is paused.
   * On web, this occurs when the pointer is moved over the viewport, the viewport is focused or when the window is blurred.
   * On mobile, this occurs when the toast is touched.
   */
  onPause?(): void
  /**
   * Event handler called when the dismiss timer is resumed.
   * On web, this occurs when the pointer is moved away from the viewport, the viewport is blurred or when the window is focused.
   * On mobile, this occurs when the toast is released.
   */
  onResume?(): void
  /**
   * Event handler called when starting a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  onSwipeStart?(event: SwipeEvent): void
  /**
   * Event handler called during a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  onSwipeMove?(event: SwipeEvent): void
  /**
   * Event handler called at the cancellation of a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  onSwipeCancel?(event: SwipeEvent): void
  /**
   * Event handler called at the end of a swipe interaction. It can be prevented by calling `event.preventDefault`.
   */
  onSwipeEnd?(event: SwipeEvent): void
  /**
   * The viewport's name to send the toast to. Used when using multiple viewports and want to forward toasts to different ones.
   *
   * @default "default"
   */
  viewportName?: string
  /**
   *
   */
  id?: string
}

type ToastImplProps = ToastImplPrivateProps & ToastImplFrameProps & ToastExtraProps

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
      viewportName = 'default',
      ...toastProps
    } = props
    const isPresent = useIsPresent()
    const context = useToastProviderContext(__scopeToast)
    const [node, setNode] = React.useState<TamaguiElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, setNode)
    const duration = durationProp || context.duration
    const closeTimerStartTimeRef = React.useRef(0)
    const closeTimerRemainingTimeRef = React.useRef(duration)
    const closeTimerRef = React.useRef(0)
    const { onToastAdd, onToastRemove } = context

    const viewport = React.useMemo(() => {
      return context.viewports[viewportName] as HTMLElement | null | undefined
    }, [context.viewports, viewportName])

    const handleClose = useEvent(() => {
      if (!isPresent) {
        // already removed from the react tree
        return
      }
      // focus viewport if focus is within toast to read the remaining toast
      // count to SR users and ensure focus isn't lost
      if (isWeb) {
        const isFocusInToast = (node as HTMLDivElement)?.contains(document.activeElement)
        if (isFocusInToast) viewport?.focus()
      }
      onClose()
    })

    const startTimer = React.useCallback(
      (duration: number) => {
        if (!duration || duration === Number.POSITIVE_INFINITY) return
        clearTimeout(closeTimerRef.current)
        closeTimerStartTimeRef.current = new Date().getTime()
        closeTimerRef.current = setTimeout(handleClose, duration) as unknown as number
      },
      [handleClose]
    )

    const handleResume = React.useCallback(() => {
      startTimer(closeTimerRemainingTimeRef.current)
      onResume?.()
    }, [onResume, startTimer])

    const handlePause = React.useCallback(() => {
      const elapsedTime = new Date().getTime() - closeTimerStartTimeRef.current
      closeTimerRemainingTimeRef.current =
        closeTimerRemainingTimeRef.current - elapsedTime
      window.clearTimeout(closeTimerRef.current)
      onPause?.()
    }, [onPause])

    React.useEffect(() => {
      if (!isWeb) return

      if (viewport) {
        viewport.addEventListener(VIEWPORT_PAUSE, handlePause)
        viewport.addEventListener(VIEWPORT_RESUME, handleResume)
        return () => {
          viewport.removeEventListener(VIEWPORT_PAUSE, handlePause)
          viewport.removeEventListener(VIEWPORT_RESUME, handleResume)
        }
      }
    }, [viewport, duration, onPause, onResume, startTimer])

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

    const isHorizontalSwipe = ['left', 'right', 'horizontal'].includes(
      context.swipeDirection
    )

    const { animationDriver } = useConfiguration()
    if (!animationDriver) {
      throw new Error('Must set animations in tamagui.config.ts')
    }

    const { useAnimatedNumber, useAnimatedNumberStyle } = animationDriver

    const animatedNumber = useAnimatedNumber(0)

    // temp until reanimated useAnimatedNumber fix
    const AnimatedView = (animationDriver['NumberView'] ??
      animationDriver.View ??
      Stack) as typeof Animated.View

    const animatedStyles = useAnimatedNumberStyle(animatedNumber, (val) => {
      'worklet'
      return {
        transform: [isHorizontalSwipe ? { translateX: val } : { translateY: val }],
      }
    })

    const panResponder = React.useMemo(() => {
      return PanResponder.create({
        onMoveShouldSetPanResponder: (e, gesture) => {
          const shouldMove = shouldGrantGestureMove(context.swipeDirection, gesture)
          if (shouldMove) {
            onSwipeStart?.(e)
            return true
          }
          return false
        },
        onPanResponderGrant: (e) => {
          if (!isWeb) {
            handlePause?.()
          }
        },
        onPanResponderMove: (e, gesture) => {
          const { x, y } = getGestureDistance(context.swipeDirection, gesture)
          const delta = { x, y }
          animatedNumber.setValue(isHorizontalSwipe ? x : y, { type: 'direct' })
          if (isDeltaInDirection(delta, context.swipeDirection, context.swipeThreshold)) {
            onSwipeEnd?.(e)
          }
          onSwipeMove?.(e)
        },
        onPanResponderEnd: (e, { dx, dy }) => {
          if (
            !isDeltaInDirection(
              { x: dx, y: dy },
              context.swipeDirection,
              context.swipeThreshold
            )
          ) {
            if (!isWeb) {
              handleResume?.()
            }
            onSwipeCancel?.(e)
            animatedNumber.setValue(0, { type: 'spring' })
          }
        },
      })
    }, [handlePause, handleResume])

    // need to get the theme name from context and apply it again since portals don't retain the theme
    const themeName = useThemeName()

    return (
      <>
        {announceTextContent && (
          <ToastAnnounce
            __scopeToast={__scopeToast}
            // Toasts are always role=status to avoid stuttering issues with role=alert in SRs.
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="status"
            aria-live={type === 'foreground' ? 'assertive' : 'polite'}
            aria-atomic
          >
            {announceTextContent}
          </ToastAnnounce>
        )}

        <PortalItem hostName={viewportName ?? 'default'}>
          <ToastInteractiveProvider
            key={props.id}
            scope={__scopeToast}
            onClose={() => {
              handleClose()
            }}
          >
            <Dismissable
              // asChild
              onEscapeKeyDown={composeEventHandlers(onEscapeKeyDown, () => {
                if (!context.isFocusedToastEscapeKeyDownRef.current) {
                  handleClose()
                }
                context.isFocusedToastEscapeKeyDownRef.current = false
              })}
            >
              <Theme forceClassName name={themeName}>
                <AnimatedView
                  {...panResponder?.panHandlers}
                  style={[{ margin: 'auto' }, animatedStyles]}
                >
                  <Collection.ItemSlot __scopeCollection={__scopeToast || TOAST_CONTEXT}>
                    <ToastImplFrame
                      // Ensure toasts are announced as status list or status when focused
                      role="status"
                      aria-live="off"
                      aria-atomic
                      data-state={open ? 'open' : 'closed'}
                      data-swipe-direction={context.swipeDirection}
                      pointerEvents="auto"
                      touchAction="none"
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
                    />
                  </Collection.ItemSlot>
                </AnimatedView>
              </Theme>
            </Dismissable>
          </ToastInteractiveProvider>
        </PortalItem>
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

const isDeltaInDirection = (
  delta: { x: number; y: number },
  direction: SwipeDirection,
  threshold = 0
) => {
  const deltaX = Math.abs(delta.x)
  const deltaY = Math.abs(delta.y)
  const isDeltaX = deltaX > deltaY
  if (direction === 'left' || direction === 'right' || direction === 'horizontal') {
    return isDeltaX && deltaX > threshold
  }
  return !isDeltaX && deltaY > threshold
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

const GESTURE_GRANT_THRESHOLD = 10

const shouldGrantGestureMove = (
  dir: SwipeDirection,
  { dx, dy }: PanResponderGestureState
) => {
  if ((dir === 'horizontal' || dir === 'left') && dx < -GESTURE_GRANT_THRESHOLD) {
    return true
  }
  if ((dir === 'horizontal' || dir === 'right') && dx > GESTURE_GRANT_THRESHOLD) {
    return true
  }
  if ((dir === 'vertical' || dir === 'up') && dy > -GESTURE_GRANT_THRESHOLD) {
    return true
  }
  if ((dir === 'vertical' || dir === 'down') && dy < GESTURE_GRANT_THRESHOLD) {
    return true
  }

  return false
}

const getGestureDistance = (
  dir: SwipeDirection,
  { dx, dy }: PanResponderGestureState
) => {
  let y = 0
  let x = 0

  if (dir === 'horizontal') x = dx
  else if (dir === 'left') x = Math.min(0, dx)
  else if (dir === 'right') x = Math.max(0, dx)
  else if (dir === 'vertical') y = dy
  else if (dir === 'up') y = Math.min(0, dy)
  else if (dir === 'down') y = Math.max(0, dy)

  return {
    x,
    y,
  }
}

export { ToastImpl, ToastImplFrame, useToastInteractiveContext, type ToastImplProps }
export type { ToastProps }
