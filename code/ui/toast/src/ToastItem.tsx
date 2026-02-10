import { isWeb } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { styled, useEvent, View } from '@tamagui/core'
import { XStack, YStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import * as React from 'react'
import type { LayoutChangeEvent } from 'react-native'

import type { ToasterPosition } from './Toaster'
import type { ToastT, ToastType } from './ToastState'
import { useAnimatedDragGesture } from './useAnimatedDragGesture'
import { useToastAnimations } from './useToastAnimations'
import type { SwipeDirection } from './ToastProvider'
import type { BurntToastOptions } from './types'
import { createNativeToast } from './createNativeToast'

// time before unmount after deletion
const TIME_BEFORE_UNMOUNT = 200

/* -------------------------------------------------------------------------------------------------
 * DragWrapper - handles drag gestures with proper event handling
 * Uses raw div on web for pointer events, AnimatedView on native
 * -----------------------------------------------------------------------------------------------*/

interface DragWrapperProps {
  isWeb: boolean
  animatedStyle: any
  gestureHandlers: any
  AnimatedView: any
  dragRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

function DragWrapper({
  isWeb: isWebProp,
  animatedStyle,
  gestureHandlers,
  AnimatedView,
  dragRef,
  children,
}: DragWrapperProps) {
  if (isWebProp) {
    // on web, use a raw div with ref for direct DOM manipulation (CSS driver)
    // the dragRef is used by useToastAnimations to directly set transform
    return (
      <div
        ref={dragRef}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          // prevent text selection during drag
          userSelect: 'none',
          WebkitUserSelect: 'none',
          // prevent touch scrolling interference
          touchAction: 'none',
          // visual feedback that this is draggable
          cursor: 'grab',
        }}
        {...gestureHandlers}
      >
        {children}
      </div>
    )
  }

  // on native, use AnimatedView with animatedStyle
  return (
    <AnimatedView style={[{ flex: 1 }, animatedStyle]} {...gestureHandlers}>
      {children}
    </AnimatedView>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ToastPositionWrapper - handles absolute positioning and stacking animations
 * This is separate from visual styling so drag transform can move the entire visual toast
 * -----------------------------------------------------------------------------------------------*/

const ToastPositionWrapper = styled(YStack, {
  name: 'ToastPositionWrapper',
  pointerEvents: 'auto',
  position: 'absolute',
  left: 0,
  right: 0,
  // for stacking animation - default visible state
  opacity: 1,
  scale: 1,
  y: 0,
  x: 0,
})

/* -------------------------------------------------------------------------------------------------
 * ToastItemFrame - visual styling for the toast
 * -----------------------------------------------------------------------------------------------*/

const ToastItemFrame = styled(YStack, {
  name: 'ToastItem',
  // prevent text selection during drag - critical for gesture handling
  userSelect: 'none',
  cursor: 'grab',
  focusable: true,

  variants: {
    unstyled: {
      false: {
        backgroundColor: '$background',
        borderRadius: '$4',
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        borderWidth: 1,
        borderColor: '$borderColor',
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,

        // sonner-style focus ring using outline
        focusVisibleStyle: {
          outlineWidth: 2,
          outlineColor: '$color8',
          outlineStyle: 'solid',
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * ToastTitle
 * -----------------------------------------------------------------------------------------------*/

const ToastItemTitle = styled(SizableText, {
  name: 'ToastItemTitle',

  variants: {
    unstyled: {
      false: {
        fontWeight: '600',
        color: '$color',
        size: '$4',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * ToastDescription
 * -----------------------------------------------------------------------------------------------*/

const ToastItemDescription = styled(SizableText, {
  name: 'ToastItemDescription',

  variants: {
    unstyled: {
      false: {
        color: '$color11',
        size: '$2',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * ToastCloseButton
 * -----------------------------------------------------------------------------------------------*/

const ToastCloseButton = styled(XStack, {
  name: 'ToastCloseButton',
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  variants: {
    unstyled: {
      false: {
        width: 20,
        height: 20,
        borderRadius: '$10',
        backgroundColor: '$color5',
        hoverStyle: {
          backgroundColor: '$color6',
        },
        pressStyle: {
          backgroundColor: '$color7',
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * ToastActionButton - for action/cancel buttons with text
 * -----------------------------------------------------------------------------------------------*/

const ToastActionButton = styled(XStack, {
  name: 'ToastActionButton',
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  variants: {
    unstyled: {
      false: {
        borderRadius: '$2',
        paddingHorizontal: '$2',
        height: 24,
        backgroundColor: '$color5',
        hoverStyle: {
          backgroundColor: '$color6',
        },
        pressStyle: {
          backgroundColor: '$color7',
        },
      },
    },

    // primary action button style
    primary: {
      true: {
        backgroundColor: '$color12',
        hoverStyle: {
          backgroundColor: '$color11',
        },
        pressStyle: {
          backgroundColor: '$color10',
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * Icons - users provide their own via icons prop, no built-in defaults
 * -----------------------------------------------------------------------------------------------*/

const DefaultCloseIcon = () => (
  <SizableText size="$1" color="$color11">
    ✕
  </SizableText>
)

/* -------------------------------------------------------------------------------------------------
 * ToastItem
 * -----------------------------------------------------------------------------------------------*/

export interface ToastItemProps {
  toast: ToastT
  index: number
  expanded: boolean
  interacting: boolean
  position: ToasterPosition
  visibleToasts: number
  removeToast: (toast: ToastT) => void
  triggerDismissCooldown: () => void
  heights: Record<string | number, number>
  setToastHeight: (toastId: string | number, height: number) => void
  removeToastHeight: (toastId: string | number) => void
  heightBeforeMe: number
  frontToastHeight: number
  duration: number
  gap: number
  swipeDirection: SwipeDirection
  swipeThreshold: number
  closeButton?: boolean
  icons?: {
    success?: React.ReactNode
    error?: React.ReactNode
    warning?: React.ReactNode
    info?: React.ReactNode
    loading?: React.ReactNode
    close?: React.ReactNode
  }
  native?: boolean
  burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>
  notificationOptions?: NotificationOptions
  /** When true, disables animations for accessibility */
  reducedMotion?: boolean
}

export const ToastItem = React.memo(function ToastItem(props: ToastItemProps) {
  const {
    toast,
    index,
    expanded,
    interacting,
    position,
    visibleToasts,
    removeToast,
    triggerDismissCooldown,
    heights,
    setToastHeight,
    removeToastHeight,
    heightBeforeMe,
    frontToastHeight,
    duration,
    gap,
    swipeDirection,
    swipeThreshold,
    closeButton,
    icons,
    native,
    burntOptions,
    notificationOptions,
    reducedMotion,
  } = props

  const [mounted, setMounted] = React.useState(false)
  const [removed, setRemoved] = React.useState(false)
  const [swipeOut, setSwipeOut] = React.useState(false)

  const toastRef = React.useRef<TamaguiElement>(null)
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerStartRef = React.useRef(0)
  const lastPauseTimeRef = React.useRef(0) // tracks when pause was called to prevent double-counting
  const remainingTimeRef = React.useRef(duration)

  const isFront = index === 0
  const isVisible = index < visibleToasts
  const toastType = toast.type ?? 'default'
  const dismissible = toast.dismissible !== false

  // parse position for animation direction
  const [yPosition] = position.split('-') as ['top' | 'bottom', string]
  const isTop = yPosition === 'top'

  // handle native toast on mobile — mount-time gate that dispatches to burnt and
  React.useEffect(() => {
    if (native && !isWeb) {
      const titleText = typeof toast.title === 'function' ? toast.title() : toast.title
      const descText =
        typeof toast.description === 'function' ? toast.description() : toast.description

      if (typeof titleText === 'string') {
        createNativeToast(titleText, {
          message: typeof descText === 'string' ? descText : undefined,
          duration,
          burntOptions,
          notificationOptions,
        })
      }
      // remove from state immediately — burnt handles display
      removeToast(toast)
    }
  }, [native])

  // trigger mount animation
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // handle deletion
  React.useEffect(() => {
    if (toast.delete) {
      setRemoved(true)
      setTimeout(() => {
        removeToast(toast)
      }, TIME_BEFORE_UNMOUNT)
    }
  }, [toast.delete, toast, removeToast])

  // auto-close timer
  const startTimer = React.useCallback(() => {
    if (duration === Number.POSITIVE_INFINITY || toastType === 'loading') return

    closeTimerStartRef.current = Date.now()
    closeTimerRef.current = setTimeout(() => {
      toast.onAutoClose?.(toast)
      setRemoved(true)
      setTimeout(() => {
        removeToast(toast)
      }, TIME_BEFORE_UNMOUNT)
    }, remainingTimeRef.current)
  }, [duration, toastType, toast, removeToast])

  const pauseTimer = useEvent(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    // only calculate elapsed time if timer was started after last pause
    // this prevents double-counting when pause is called multiple times (Sonner pattern)
    if (lastPauseTimeRef.current < closeTimerStartRef.current) {
      const elapsed = Date.now() - closeTimerStartRef.current
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
    }
    lastPauseTimeRef.current = Date.now()
  })

  const resumeTimer = useEvent(() => {
    startTimer()
  })

  // start/pause timer based on expanded/interacting state
  React.useEffect(() => {
    if (expanded || interacting) {
      pauseTimer()
    } else {
      startTimer()
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [expanded, interacting, startTimer])

  // reset remaining time when duration changes
  React.useEffect(() => {
    remainingTimeRef.current = duration
  }, [duration])

  // animation driver for drag gestures
  const { setDragOffset, springBack, animateOut, animatedStyle, AnimatedView, dragRef } =
    useToastAnimations({
      reducedMotion,
      swipeAxis:
        swipeDirection === 'up' ||
        swipeDirection === 'down' ||
        swipeDirection === 'vertical'
          ? 'vertical'
          : 'horizontal',
    })

  // drag gesture with animation driver integration
  const { isDragging, gestureHandlers } = useAnimatedDragGesture({
    direction: swipeDirection,
    threshold: swipeThreshold,
    disabled: !dismissible || toastType === 'loading',
    expanded,
    onDragStart: pauseTimer,
    onDragMove: setDragOffset,
    onDismiss: (exitDirection, velocity) => {
      // trigger cooldown IMMEDIATELY to prevent collapse during stack rebalance
      triggerDismissCooldown()
      setSwipeOut(true)
      toast.onDismiss?.(toast)
      setRemoved(true)
      // remove height immediately so remaining toasts can reposition right away
      removeToastHeight(toast.id)
      // use animateOut for smooth velocity-based exit animation
      // this continues the drag momentum into the exit, then removes the toast
      animateOut(exitDirection, velocity, () => {
        removeToast(toast)
      })
    },
    onCancel: () => {
      springBack(() => {
        resumeTimer()
      })
    },
  })

  // measure height
  // Skip when collapsed and not front — onLayout reports scaled dimensions
  // (e.g. 51 * 0.9 = 45.9) that would corrupt height tracking
  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      if (!expanded && index !== 0) return
      const { height } = event.nativeEvent.layout
      setToastHeight(toast.id, height)
    },
    [toast.id, setToastHeight, index, expanded]
  )

  // cleanup height on unmount
  React.useEffect(() => {
    return () => {
      removeToastHeight(toast.id)
    }
  }, [toast.id, removeToastHeight])

  const handleClose = React.useCallback(() => {
    if (!dismissible) return
    toast.onDismiss?.(toast)
    setRemoved(true)
    setTimeout(() => {
      removeToast(toast)
    }, TIME_BEFORE_UNMOUNT)
  }, [dismissible, toast, removeToast])

  // get icon - only show if explicitly provided via toast.icon or icons prop
  const getIcon = () => {
    // per-toast icon takes priority
    if (toast.icon !== undefined) return toast.icon

    // fall back to type-based icon from icons prop (no built-in defaults)
    return icons?.[toastType] ?? null
  }

  const icon = getIcon()

  // calculate values for stacking effect using Tamagui animation props
  // NOTE: drag offset is now handled separately by AnimatedView with useAnimatedNumber

  // scale non-front toasts when not expanded (sonner-style stacking)
  // each toast behind front is scaled down by 5% - this creates visual depth
  const stackScale = !expanded && !isFront ? 1 - index * 0.05 : 1

  // frontToastHeight is passed from parent (looked up by front toast ID)

  // y position: expanded shows full offset based on preceding toast heights
  // collapsed mode shows visual stacking with small peek

  // expanded offset: use heightBeforeMe (sum of preceding heights) + gaps
  const expandedOffset = heightBeforeMe + index * gap

  // collapsed mode: create visual stack where each toast peeks behind the one in front
  const peekVisible = 10 // how many pixels of back toast border should peek
  const liftPerToast = peekVisible // lift this much for each toast in stack

  const stackY = expanded
    ? isTop
      ? expandedOffset
      : -expandedOffset
    : isFront
      ? 0
      : isTop
        ? liftPerToast * index // for top position, toasts stack downward
        : -liftPerToast * index // for bottom position, toasts stack upward

  // stacking position (drag offset handled separately by AnimatedView)
  const computedY = stackY
  const computedScale = stackScale

  // opacity: toasts beyond visibleToasts are always hidden (like Sonner)
  // this applies in BOTH collapsed and expanded states
  // in collapsed mode, the last visible toast also fades slightly
  const computedOpacity =
    removed && !swipeOut
      ? 0
      : index >= visibleToasts
        ? 0
        : !expanded && index === visibleToasts - 1
          ? 0.5
          : 1

  // z-index: front toast should be on top, back toasts below
  // higher z-index = more in front
  // exiting toasts (removed=true) get lower z-index so entering toasts appear above them
  const computedZIndex = removed ? 0 : visibleToasts - index + 1
  const computedHeight = !expanded && !isFront ? frontToastHeight : undefined
  // hidden toasts should not intercept pointer events (like Sonner)
  const computedPointerEvents = index >= visibleToasts ? 'none' : 'auto'

  // render custom JSX if provided
  if (toast.jsx) {
    return toast.jsx
  }

  const title = typeof toast.title === 'function' ? toast.title() : toast.title
  const description =
    typeof toast.description === 'function' ? toast.description() : toast.description

  // data attributes for testing/styling
  const dataAttributes = {
    'data-mounted': mounted ? 'true' : 'false',
    'data-removed': removed ? 'true' : 'false',
    'data-swipe-out': swipeOut ? 'true' : 'false',
    'data-visible': isVisible ? 'true' : 'false',
    'data-front': isFront ? 'true' : 'false',
    'data-index': String(index),
    'data-type': toastType,
    'data-expanded': expanded ? 'true' : 'false',
  }

  // gap filler height - extends hit area to prevent flicker when moving between toasts
  // only needed when expanded (toasts have visual gaps between them)
  const gapFillerHeight = expanded ? gap + 1 : 0

  return (
    <ToastPositionWrapper
      ref={toastRef}
      {...dataAttributes}
      // use Tamagui transition for stacking animations (y, scale, opacity)
      // use a fast timing animation (not spring) so exit doesn't take forever
      // disable during drag so stacking doesn't interfere with drag gesture
      // also disable for reduced motion preference
      transition={isDragging || reducedMotion ? undefined : '200ms'}
      animateOnly={['transform', 'opacity']}
      // stacking animation props (NOT drag - drag is handled by inner DragWrapper)
      y={computedY}
      scale={computedScale}
      opacity={computedOpacity}
      zIndex={computedZIndex}
      height={computedHeight}
      overflow="visible"
      pointerEvents={computedPointerEvents as any}
      // anchor position: top positions anchor at top, bottom positions anchor at bottom
      top={isTop ? 0 : undefined}
      bottom={isTop ? undefined : 0}
      // transform-origin: scale from bottom for bottom position, top for top position
      // this ensures the stack peek is visible in the correct direction
      {...(isWeb &&
        !isFront && {
          style: { transformOrigin: isTop ? 'top center' : 'bottom center' },
        })}
      // enter/exit styles for AnimatePresence
      // subtle animations - small y shift + opacity fade
      // when reducedMotion, only fade opacity (no transform)
      enterStyle={
        reducedMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: isTop ? -10 : 10,
              scale: 0.95,
            }
      }
      exitStyle={
        reducedMotion
          ? { opacity: 0 }
          : swipeOut
            ? { opacity: 0, x: 0, y: 0, scale: 1 }
            : { opacity: 0, y: stackY, scale: stackScale }
      }
    >
      {/* Drag wrapper - wraps the entire visual toast so drag moves everything */}
      <DragWrapper
        isWeb={isWeb}
        animatedStyle={animatedStyle}
        gestureHandlers={gestureHandlers}
        AnimatedView={AnimatedView}
        dragRef={dragRef}
      >
        <ToastItemFrame
          // biome-ignore lint/a11y/useSemanticElements: we can't use <output> element as this is a styled Tamagui component
          role="status"
          aria-live="polite"
          aria-atomic
          tabIndex={0}
          onLayout={handleLayout}
          {...(isWeb && {
            onKeyDown: (event: React.KeyboardEvent) => {
              if (event.key === 'Escape' && dismissible) {
                handleClose()
              }
            },
          })}
        >
          {/* invisible hit area that fills the gap above/below toast when expanded
              this prevents hover state flickering when mouse moves between toasts */}
          {expanded && gapFillerHeight > 0 && (
            <View
              position="absolute"
              left={0}
              right={0}
              height={gapFillerHeight}
              pointerEvents="auto"
              {
                ...(isTop
                  ? { top: '100%' } // for top position, extend downward
                  : { bottom: '100%' }) // for bottom position, extend upward
              }
            />
          )}
          <XStack alignItems="flex-start" gap="$3">
            {icon && (
              <View flexShrink={0} marginTop="$0.5">
                {icon}
              </View>
            )}

            <YStack flex={1} gap="$1">
              {title && <ToastItemTitle>{title}</ToastItemTitle>}
              {description && <ToastItemDescription>{description}</ToastItemDescription>}
            </YStack>

            {closeButton && dismissible && (
              <ToastCloseButton onPress={handleClose} aria-label="Close toast">
                {icons?.close ?? <DefaultCloseIcon />}
              </ToastCloseButton>
            )}
          </XStack>

          {/* Action buttons */}
          {(toast.action || toast.cancel) && (
            <XStack marginTop="$2" gap="$2">
              {toast.cancel && (
                <ToastActionButton
                  backgroundColor="transparent"
                  onPress={(event) => {
                    toast.cancel?.onClick?.(event as any)
                    handleClose()
                  }}
                >
                  <SizableText size="$2" color="$color11">
                    {toast.cancel.label}
                  </SizableText>
                </ToastActionButton>
              )}
              {toast.action && (
                <ToastActionButton
                  primary
                  onPress={(event) => {
                    toast.action?.onClick?.(event as any)
                    if (!(event as any).defaultPrevented) {
                      handleClose()
                    }
                  }}
                >
                  <SizableText size="$2" fontWeight="600" color="$background">
                    {toast.action.label}
                  </SizableText>
                </ToastActionButton>
              )}
            </XStack>
          )}
        </ToastItemFrame>
      </DragWrapper>
    </ToastPositionWrapper>
  )
})

ToastItem.displayName = 'ToastItem'
