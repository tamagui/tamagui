import { isWeb } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { styled, useEvent, View } from '@tamagui/core'
import { XStack, YStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import * as React from 'react'
import type { LayoutChangeEvent } from 'react-native'

import type { HeightT, ToasterPosition } from './Toaster'
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
        marginTop: '$1',
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
 * Icons
 * -----------------------------------------------------------------------------------------------*/

const ICON_SIZE = 20

const DefaultCloseIcon = () => (
  <SizableText size="$1" color="$color11">
    ✕
  </SizableText>
)

const DefaultSuccessIcon = () => (
  <View width={ICON_SIZE} height={ICON_SIZE}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
    >
      <circle cx="12" cy="12" r="10" fill="var(--green5)" />
      <path
        d="M8 12.5l2.5 2.5 5.5-5.5"
        stroke="var(--green10)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </View>
)

const DefaultErrorIcon = () => (
  <View width={ICON_SIZE} height={ICON_SIZE}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
    >
      <circle cx="12" cy="12" r="10" fill="var(--red5)" />
      <path
        d="M15 9l-6 6M9 9l6 6"
        stroke="var(--red10)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </View>
)

const DefaultWarningIcon = () => (
  <View width={ICON_SIZE} height={ICON_SIZE}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
    >
      <path
        d="M12 3L2 21h20L12 3z"
        fill="var(--yellow5)"
        stroke="var(--yellow8)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="var(--yellow11)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="var(--yellow11)" />
    </svg>
  </View>
)

const DefaultInfoIcon = () => (
  <View width={ICON_SIZE} height={ICON_SIZE}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
    >
      <circle cx="12" cy="12" r="10" fill="var(--blue5)" />
      <path d="M12 11v5" stroke="var(--blue10)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="var(--blue10)" />
    </svg>
  </View>
)

const spinKeyframes = isWeb
  ? `
@keyframes toast-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`
  : ''

// inject keyframes once on web
if (isWeb && typeof document !== 'undefined') {
  const styleId = 'tamagui-toast-spin'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = spinKeyframes
    document.head.appendChild(style)
  }
}

const DefaultLoadingIcon = () => (
  <View
    width={ICON_SIZE}
    height={ICON_SIZE}
    {...(isWeb && {
      style: {
        animation: 'toast-spin 1s linear infinite',
      },
    })}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={ICON_SIZE}
      height={ICON_SIZE}
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="var(--color5)" strokeWidth="2.5" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="var(--color11)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </View>
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
  heights: HeightT[]
  setHeights: React.Dispatch<React.SetStateAction<HeightT[]>>
  /** Sum of heights of all toasts before this one (for expanded positioning) */
  heightBeforeMe: number
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
  disableNative?: boolean
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
    heights,
    setHeights,
    heightBeforeMe,
    duration,
    gap,
    swipeDirection,
    swipeThreshold,
    closeButton,
    icons,
    disableNative,
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

  // calculate offset based on heights of previous toasts
  const heightIndex = React.useMemo(
    () => heights.findIndex((h) => h.toastId === toast.id) || 0,
    [heights, toast.id]
  )

  const toastsHeightBefore = React.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) return prev
      return prev + curr.height
    }, 0)
  }, [heights, heightIndex])

  const offset = heightIndex * gap + toastsHeightBefore

  // parse position for animation direction
  const [yPosition] = position.split('-') as ['top' | 'bottom', string]
  const isTop = yPosition === 'top'

  // handle native toast on mobile
  React.useEffect(() => {
    if (!disableNative && !isWeb) {
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
    }
  }, [])

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
    useToastAnimations({ reducedMotion })

  // drag gesture with animation driver integration
  const { isDragging, gestureHandlers } = useAnimatedDragGesture({
    direction: swipeDirection,
    threshold: swipeThreshold,
    disabled: !dismissible || toastType === 'loading',
    expanded,
    onDragStart: pauseTimer,
    onDragMove: setDragOffset,
    onDismiss: (exitDirection, velocity) => {
      setSwipeOut(true)
      toast.onDismiss?.(toast)
      setRemoved(true)
      // remove height immediately so remaining toasts can reposition right away
      // (don't wait for exit animation to complete)
      setHeights((prev) => prev.filter((h) => h.toastId !== toast.id))
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
  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout

      setHeights((prev) => {
        const exists = prev.find((h) => h.toastId === toast.id)
        if (exists) {
          return prev.map((h) => (h.toastId === toast.id ? { ...h, height } : h))
        }
        return [{ toastId: toast.id, height, position }, ...prev]
      })
    },
    [toast.id, position, setHeights]
  )

  // cleanup height on unmount
  React.useEffect(() => {
    return () => {
      setHeights((prev) => prev.filter((h) => h.toastId !== toast.id))
    }
  }, [toast.id, setHeights])

  const handleClose = React.useCallback(() => {
    if (!dismissible) return
    toast.onDismiss?.(toast)
    setRemoved(true)
    setTimeout(() => {
      removeToast(toast)
    }, TIME_BEFORE_UNMOUNT)
  }, [dismissible, toast, removeToast])

  // get icon - just use what's passed on the toast, or type-based defaults
  const getIcon = () => {
    if (toast.icon !== undefined) return toast.icon

    const typeIcons: Record<ToastType, React.ReactNode> = {
      default: null,
      success: icons?.success ?? <DefaultSuccessIcon />,
      error: icons?.error ?? <DefaultErrorIcon />,
      warning: icons?.warning ?? <DefaultWarningIcon />,
      info: icons?.info ?? <DefaultInfoIcon />,
      loading: icons?.loading ?? <DefaultLoadingIcon />,
    }

    return typeIcons[toastType]
  }

  const icon = getIcon()

  // calculate values for stacking effect using Tamagui animation props
  // NOTE: drag offset is now handled separately by AnimatedView with useAnimatedNumber

  // scale non-front toasts when not expanded (sonner-style stacking)
  // each toast behind front is scaled down by 5% - this creates visual depth
  const stackScale = !expanded && !isFront ? 1 - index * 0.05 : 1

  // get the height of the front toast for collapsed positioning
  const frontToastHeight = heights.length > 0 ? (heights[0]?.height ?? 55) : 55

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
  let computedOpacity = 1
  if (index >= visibleToasts) {
    computedOpacity = 0 // completely hidden beyond limit (both states)
  } else if (!expanded && index === visibleToasts - 1) {
    computedOpacity = 0.5 // last visible toast fades in collapsed mode only
  }

  // z-index: front toast should be on top, back toasts below
  // higher z-index = more in front
  // exiting toasts (removed=true) get lower z-index so entering toasts appear above them
  const computedZIndex = removed ? 0 : visibleToasts - index + 1
  // in collapsed mode, set back toasts to front toast height (sonner pattern)
  // this makes the stack work by having all toasts same height
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
      onLayout={handleLayout}
      // use Tamagui transition for stacking animations (y, scale, opacity)
      // use a fast timing animation (not spring) so exit doesn't take forever
      // disable during drag so stacking doesn't interfere with drag gesture
      // also disable for reduced motion preference
      transition={isDragging || reducedMotion ? undefined : '200ms'}
      // stacking animation props (NOT drag - drag is handled by inner DragWrapper)
      y={computedY}
      scale={computedScale}
      opacity={computedOpacity}
      zIndex={computedZIndex}
      height={computedHeight}
      overflow={computedHeight ? 'hidden' : undefined}
      pointerEvents={computedPointerEvents as any}
      // anchor position: top positions anchor at top, bottom positions anchor at bottom
      top={isTop ? 0 : undefined}
      bottom={isTop ? undefined : 0}
      // transform-origin: scale from bottom for bottom position, top for top position
      // this ensures the stack peek is visible in the correct direction
      {...(isWeb &&
        !isFront &&
        !expanded && {
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
          : {
              opacity: 0,
              // for swipe dismissal, drag transform handles position via animateOut
              // for non-swipe dismissal (close button, timeout), use subtle position shift
              x: 0,
              y: swipeOut ? 0 : isTop ? -10 : 10,
              scale: swipeOut ? 1 : 0.95,
            }
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
            <XStack marginTop="$3" gap="$2" justifyContent="flex-end">
              {toast.cancel && (
                <ToastActionButton
                  onPress={(event) => {
                    toast.cancel?.onClick?.(event as any)
                    handleClose()
                  }}
                >
                  <SizableText size="$2">{toast.cancel.label}</SizableText>
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
