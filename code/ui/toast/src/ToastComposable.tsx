import { AnimatePresence } from '@tamagui/animate-presence'
import { isWeb } from '@tamagui/constants'
import type { GetProps, TamaguiElement } from '@tamagui/core'
import { createStyledContext, styled, Theme, useThemeName, View } from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
import { Portal } from '@tamagui/portal'
import { XStack, YStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import * as React from 'react'
import type { SwipeDirection } from './ToastProvider'
import type { ExternalToast, ToastT, ToastToDismiss } from './ToastState'
import { ToastState } from './ToastState'
import { useAnimatedDragGesture } from './useAnimatedDragGesture'
import { useToastAnimations } from './useToastAnimations'
import { useReducedMotion } from './useReducedMotion'

// defaults
const VISIBLE_TOASTS_AMOUNT = 4
const VIEWPORT_OFFSET = 24
const TOAST_GAP = 14
const TOAST_LIFETIME = 4000
const TIME_BEFORE_UNMOUNT = 200

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

interface HeightT {
  toastId: string | number
  height: number
}

interface ToastContextValue {
  toasts: ToastT[]
  heights: HeightT[]
  setHeights: React.Dispatch<React.SetStateAction<HeightT[]>>
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  interacting: boolean
  setInteracting: React.Dispatch<React.SetStateAction<boolean>>
  removeToast: (toast: ToastT) => void
  position: ToastPosition
  duration: number
  gap: number
  visibleToasts: number
  swipeDirection: SwipeDirection
  swipeThreshold: number
  closeButton: boolean
  reducedMotion: boolean
}

const ToastContext = createStyledContext<ToastContextValue>(
  {} as ToastContextValue,
  'Toast__'
)

const useToastContext = ToastContext.useStyledContext

/* -------------------------------------------------------------------------------------------------
 * Toast (Root)
 * -----------------------------------------------------------------------------------------------*/

export interface ToastRootProps {
  children: React.ReactNode
  /**
   * Position of the toasts on screen
   * @default 'bottom-right'
   */
  position?: ToastPosition
  /**
   * Default duration for toasts in ms
   * @default 4000
   */
  duration?: number
  /**
   * Gap between toasts in pixels
   * @default 14
   */
  gap?: number
  /**
   * Number of toasts visible at once
   * @default 4
   */
  visibleToasts?: number
  /**
   * Direction toasts can be swiped to dismiss
   * @default 'auto'
   */
  swipeDirection?: SwipeDirection
  /**
   * Distance in pixels swipe must pass to dismiss
   * @default 50
   */
  swipeThreshold?: number
  /**
   * Show close button on toasts
   * @default false
   */
  closeButton?: boolean
  /**
   * Theme for toasts
   */
  theme?: 'light' | 'dark' | 'system'
  /**
   * Force reduced motion mode
   */
  reducedMotion?: boolean
}

function resolveSwipeDirection(
  direction: SwipeDirection,
  position: ToastPosition
): Exclude<SwipeDirection, 'auto'> {
  if (direction !== 'auto') return direction
  const [yPosition, xPosition] = position.split('-') as [
    'top' | 'bottom',
    'left' | 'center' | 'right',
  ]
  if (xPosition === 'left') return 'left'
  if (xPosition === 'right') return 'right'
  return yPosition === 'top' ? 'up' : 'down'
}

const ToastRoot = React.forwardRef<TamaguiElement, ToastRootProps>(
  function ToastRoot(props, ref) {
    const {
      children,
      position = 'bottom-right',
      duration = TOAST_LIFETIME,
      gap = TOAST_GAP,
      visibleToasts = VISIBLE_TOASTS_AMOUNT,
      swipeDirection: swipeDirectionProp = 'auto',
      swipeThreshold = 50,
      closeButton = false,
      theme: themeProp,
      reducedMotion: reducedMotionProp,
    } = props

    const reducedMotion = useReducedMotion(reducedMotionProp)
    const [toasts, setToasts] = React.useState<ToastT[]>([])
    const [heights, setHeights] = React.useState<HeightT[]>([])
    const [expanded, setExpanded] = React.useState(false)
    const [interacting, setInteracting] = React.useState(false)

    // subscribe to toast state
    React.useEffect(() => {
      return ToastState.subscribe((toast) => {
        if ((toast as ToastToDismiss).dismiss) {
          setToasts((toasts) =>
            toasts.map((t) => (t.id === toast.id ? { ...t, delete: true } : t))
          )
          return
        }
        setToasts((toasts) => {
          const idx = toasts.findIndex((t) => t.id === toast.id)
          if (idx !== -1) {
            return [
              ...toasts.slice(0, idx),
              { ...toasts[idx], ...toast },
              ...toasts.slice(idx + 1),
            ]
          }
          return [toast as ToastT, ...toasts]
        })
      })
    }, [])

    // collapse when 1 toast
    React.useEffect(() => {
      if (toasts.length <= 1) setExpanded(false)
    }, [toasts.length])

    const removeToast = React.useCallback((toastToRemove: ToastT) => {
      setToasts((toasts) => {
        if (!toasts.find((t) => t.id === toastToRemove.id)?.delete) {
          ToastState.dismiss(toastToRemove.id)
        }
        return toasts.filter(({ id }) => id !== toastToRemove.id)
      })
    }, [])

    const swipeDirection = resolveSwipeDirection(swipeDirectionProp, position)

    const currentTheme = useThemeName()
    const resolvedTheme =
      themeProp === 'system' || !themeProp
        ? currentTheme?.includes('dark')
          ? 'dark'
          : 'light'
        : themeProp

    const contextValue: ToastContextValue = {
      toasts,
      heights,
      setHeights,
      expanded,
      setExpanded,
      interacting,
      setInteracting,
      removeToast,
      position,
      duration,
      gap,
      visibleToasts,
      swipeDirection,
      swipeThreshold,
      closeButton,
      reducedMotion,
    }

    return (
      <ToastContext.Provider {...contextValue}>
        <Theme name={resolvedTheme as any}>{children}</Theme>
      </ToastContext.Provider>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * ToastViewport
 * -----------------------------------------------------------------------------------------------*/

const ToastViewportFrame = styled(View, {
  name: 'ToastViewport',

  variants: {
    unstyled: {
      false: {
        position: isWeb ? ('fixed' as any) : 'absolute',
        zIndex: 100000,
        pointerEvents: 'box-none',
        maxWidth: '100%',
        width: 356,
        minHeight: 1,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export interface ToastViewportProps extends GetProps<typeof ToastViewportFrame> {
  /**
   * Offset from screen edge
   * @default 24
   */
  offset?: number | { top?: number; right?: number; bottom?: number; left?: number }
  /**
   * Hotkey to focus viewport
   */
  hotkey?: string[]
  /**
   * Aria label
   * @default 'Notifications'
   */
  label?: string
  /**
   * Portal to root
   * @default true
   */
  portalToRoot?: boolean
}

const ToastViewport = ToastViewportFrame.styleable<ToastViewportProps>(
  function ToastViewport(props, ref) {
    const {
      offset = VIEWPORT_OFFSET,
      hotkey = ['altKey', 'KeyT'],
      label = 'Notifications',
      portalToRoot = true,
      children,
      ...rest
    } = props

    const ctx = useToastContext()
    const listRef = React.useRef<TamaguiElement>(null)
    const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const hoverCooldownRef = React.useRef(false)

    const [yPosition, xPosition] = ctx.position.split('-') as [
      'top' | 'bottom',
      'left' | 'center' | 'right',
    ]

    // offset styles
    const offsetStyles = React.useMemo(() => {
      const styles: any = {}
      const defaultOffset = typeof offset === 'number' ? offset : VIEWPORT_OFFSET
      const offsetObj =
        typeof offset === 'object'
          ? offset
          : {
              top: defaultOffset,
              right: defaultOffset,
              bottom: defaultOffset,
              left: defaultOffset,
            }

      if (yPosition === 'top') styles.top = offsetObj.top ?? defaultOffset
      else styles.bottom = offsetObj.bottom ?? defaultOffset

      if (xPosition === 'left') styles.left = offsetObj.left ?? defaultOffset
      else if (xPosition === 'right') styles.right = offsetObj.right ?? defaultOffset
      else {
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
      }

      return styles
    }, [offset, yPosition, xPosition])

    // hotkey
    React.useEffect(() => {
      if (!isWeb) return
      const handleKeyDown = (event: KeyboardEvent) => {
        const isHotkeyPressed =
          hotkey.length > 0 &&
          hotkey.every((key) => (event as any)[key] || event.code === key)
        if (isHotkeyPressed) {
          ctx.setExpanded(true)
          ;(listRef.current as HTMLElement)?.focus()
        }
        if (event.code === 'Escape') {
          ctx.setExpanded(false)
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [hotkey])

    if (ctx.toasts.length === 0) return null

    const hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')

    const content = (
      <ToastViewportFrame
        ref={listRef}
        aria-label={`${label} ${hotkeyLabel}`}
        tabIndex={-1}
        aria-live="polite"
        style={offsetStyles}
        data-y-position={yPosition}
        data-x-position={xPosition}
        onMouseEnter={() => {
          if (ctx.toasts.length > 1 && !ctx.interacting && !hoverCooldownRef.current) {
            hoverTimeoutRef.current = setTimeout(() => ctx.setExpanded(true), 50)
          }
        }}
        onMouseLeave={() => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
          }
          if (!ctx.interacting) ctx.setExpanded(false)
        }}
        onPointerDown={() => {
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
          }
          ctx.setInteracting(true)
        }}
        onPointerUp={() => ctx.setInteracting(false)}
        {...rest}
      >
        <AnimatePresence>{children}</AnimatePresence>
      </ToastViewportFrame>
    )

    if (portalToRoot && isWeb) {
      return <Portal>{content}</Portal>
    }

    return content
  }
)

/* -------------------------------------------------------------------------------------------------
 * ToastItem (the wrapper with stacking/drag)
 * -----------------------------------------------------------------------------------------------*/

const ToastItemFrame = styled(YStack, {
  name: 'ToastItem',

  variants: {
    unstyled: {
      false: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '$background',
        borderRadius: '$4',
        borderWidth: 1,
        borderColor: '$borderColor',
        padding: '$3',
        elevation: '$3',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export interface ToastItemProps extends GetProps<typeof ToastItemFrame> {
  toast: ToastT
  index: number
  children: React.ReactNode
}

const ToastItemInner = ToastItemFrame.styleable<ToastItemProps>(
  function ToastItem(props, ref) {
    const { toast, index, children, ...rest } = props
    const ctx = useToastContext()

    const [mounted, setMounted] = React.useState(false)
    const [removed, setRemoved] = React.useState(false)
    const [swipeOut, setSwipeOut] = React.useState(false)

    const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const closeTimerStartRef = React.useRef(0)
    const remainingTimeRef = React.useRef(toast.duration ?? ctx.duration)

    const isFront = index === 0
    const isVisible = index < ctx.visibleToasts
    const toastType = toast.type ?? 'default'
    const dismissible = toast.dismissible !== false
    const duration = toast.duration ?? ctx.duration

    const [yPosition] = ctx.position.split('-') as ['top' | 'bottom', string]
    const isTop = yPosition === 'top'

    // height tracking
    const heightIndex = React.useMemo(
      () => ctx.heights.findIndex((h) => h.toastId === toast.id) || 0,
      [ctx.heights, toast.id]
    )

    const toastsHeightBefore = React.useMemo(() => {
      return ctx.heights.reduce((prev, curr, i) => {
        if (i >= heightIndex) return prev
        return prev + curr.height
      }, 0)
    }, [ctx.heights, heightIndex])

    // timer
    const startTimer = React.useCallback(() => {
      if (duration === Number.POSITIVE_INFINITY) return
      closeTimerStartRef.current = Date.now()
      closeTimerRef.current = setTimeout(() => {
        toast.onAutoClose?.(toast)
        setRemoved(true)
        setTimeout(() => ctx.removeToast(toast), TIME_BEFORE_UNMOUNT)
      }, remainingTimeRef.current)
    }, [duration, toast, ctx.removeToast])

    const pauseTimer = React.useCallback(() => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        const elapsed = Date.now() - closeTimerStartRef.current
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
      }
    }, [])

    React.useEffect(() => {
      setMounted(true)
      startTimer()
      return () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      }
    }, [])

    React.useEffect(() => {
      if (ctx.expanded || ctx.interacting) pauseTimer()
      else startTimer()
    }, [ctx.expanded, ctx.interacting])

    // animations
    const {
      setDragOffset,
      springBack,
      animateOut,
      animatedStyle,
      AnimatedView,
      dragRef,
    } = useToastAnimations({ reducedMotion: ctx.reducedMotion })

    const { isDragging, gestureHandlers } = useAnimatedDragGesture({
      direction: ctx.swipeDirection,
      threshold: ctx.swipeThreshold,
      disabled: !dismissible || toastType === 'loading',
      expanded: ctx.expanded,
      onDragStart: pauseTimer,
      onDragMove: setDragOffset,
      onDismiss: (exitDirection, velocity) => {
        setSwipeOut(true)
        toast.onDismiss?.(toast)
        setRemoved(true)
        ctx.setHeights((prev) => prev.filter((h) => h.toastId !== toast.id))
        animateOut(exitDirection, velocity, () => ctx.removeToast(toast))
      },
      onCancel: () => springBack(() => startTimer()),
    })

    // measure height
    const handleLayout = React.useCallback(
      (event: any) => {
        const { height } = event.nativeEvent.layout
        ctx.setHeights((prev) => {
          const exists = prev.find((h) => h.toastId === toast.id)
          if (exists)
            return prev.map((h) => (h.toastId === toast.id ? { ...h, height } : h))
          return [{ toastId: toast.id, height }, ...prev]
        })
      },
      [toast.id]
    )

    React.useEffect(() => {
      return () => {
        ctx.setHeights((prev) => prev.filter((h) => h.toastId !== toast.id))
      }
    }, [toast.id])

    const handleClose = React.useCallback(() => {
      if (!dismissible) return
      toast.onDismiss?.(toast)
      setRemoved(true)
      setTimeout(() => ctx.removeToast(toast), TIME_BEFORE_UNMOUNT)
    }, [dismissible, toast, ctx.removeToast])

    // stacking calculations
    const frontToastHeight = ctx.heights.length > 0 ? (ctx.heights[0]?.height ?? 55) : 55
    const stackScale = !ctx.expanded && !isFront ? 1 - index * 0.05 : 1
    const expandedOffset = toastsHeightBefore + index * ctx.gap
    const peekVisible = 10
    const stackY = ctx.expanded
      ? isTop
        ? expandedOffset
        : -expandedOffset
      : isFront
        ? 0
        : isTop
          ? peekVisible * index
          : -peekVisible * index

    const computedOpacity =
      index >= ctx.visibleToasts
        ? 0
        : !ctx.expanded && index === ctx.visibleToasts - 1
          ? 0.5
          : 1
    const computedZIndex = removed ? 0 : ctx.visibleToasts - index + 1
    const computedHeight = !ctx.expanded && !isFront ? frontToastHeight : undefined

    const dragContent =
      typeof children === 'function'
        ? (children as any)({ toast, handleClose })
        : children

    return (
      <ToastItemFrame
        ref={ref}
        onLayout={handleLayout}
        transition={isDragging || ctx.reducedMotion ? undefined : '200ms'}
        y={stackY}
        scale={stackScale}
        opacity={computedOpacity}
        zIndex={computedZIndex}
        height={computedHeight}
        overflow={computedHeight ? 'hidden' : undefined}
        pointerEvents={index >= ctx.visibleToasts ? 'none' : 'auto'}
        top={isTop ? 0 : undefined}
        bottom={isTop ? undefined : 0}
        enterStyle={
          ctx.reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, y: isTop ? -10 : 10, scale: 0.95 }
        }
        exitStyle={
          ctx.reducedMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                y: swipeOut ? 0 : isTop ? -10 : 10,
                scale: swipeOut ? 1 : 0.95,
              }
        }
        {...rest}
      >
        {isWeb ? (
          <div
            ref={dragRef as any}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              userSelect: 'none',
              touchAction: 'none',
              cursor: 'grab',
            }}
            {...gestureHandlers}
          >
            {dragContent}
          </div>
        ) : (
          <View style={{ flex: 1 }} {...(gestureHandlers as any)}>
            {dragContent}
          </View>
        )}
      </ToastItemFrame>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * ToastTitle
 * -----------------------------------------------------------------------------------------------*/

const ToastTitle = styled(SizableText, {
  name: 'ToastTitle',

  variants: {
    unstyled: {
      false: {
        color: '$color',
        fontWeight: '600',
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

const ToastDescription = styled(SizableText, {
  name: 'ToastDescription',

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
 * ToastClose
 * -----------------------------------------------------------------------------------------------*/

const ToastCloseFrame = styled(XStack, {
  name: 'ToastClose',
  render: 'button',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',

  variants: {
    unstyled: {
      false: {
        width: 20,
        height: 20,
        borderRadius: '$1',
        backgroundColor: 'transparent',
        hoverStyle: { backgroundColor: '$color5' },
        pressStyle: { backgroundColor: '$color6' },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const ToastClose = ToastCloseFrame.styleable(function ToastClose(props, ref) {
  return (
    <ToastCloseFrame ref={ref} aria-label="Close toast" {...props}>
      {props.children ?? (
        <SizableText size="$1" color="$color11">
          ✕
        </SizableText>
      )}
    </ToastCloseFrame>
  )
})

/* -------------------------------------------------------------------------------------------------
 * ToastAction
 * -----------------------------------------------------------------------------------------------*/

const ToastAction = styled(XStack, {
  name: 'ToastAction',
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
        hoverStyle: { backgroundColor: '$color6' },
        pressStyle: { backgroundColor: '$color7' },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

/* -------------------------------------------------------------------------------------------------
 * useToasts hook for rendering
 * -----------------------------------------------------------------------------------------------*/

export function useToasts() {
  const ctx = useToastContext()
  return {
    toasts: ctx.toasts,
    expanded: ctx.expanded,
    position: ctx.position,
  }
}

/* -------------------------------------------------------------------------------------------------
 * Export
 * -----------------------------------------------------------------------------------------------*/

export const Toast = withStaticProperties(ToastRoot, {
  Viewport: ToastViewport,
  Item: ToastItemInner,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
  Action: ToastAction,
})

export type { ToastT, ExternalToast }
