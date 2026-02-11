import { AnimatePresence } from '@tamagui/animate-presence'
import { isWeb } from '@tamagui/constants'
import type { GetProps, TamaguiElement } from '@tamagui/core'
import {
  createStyledContext,
  styled,
  Theme,
  useEvent,
  useThemeName,
  View,
} from '@tamagui/core'
import { withStaticProperties } from '@tamagui/helpers'
import { Portal } from '@tamagui/portal'
import { XStack, YStack } from '@tamagui/stacks'
import { SizableText } from '@tamagui/text'
import * as React from 'react'
import type { SwipeDirection } from './ToastProvider'
import type { ExternalToast, ToastT, ToastToDismiss, ToastType } from './ToastState'
import { ToastState } from './ToastState'
import type { BurntToastOptions } from './types'
import { createNativeToast } from './createNativeToast'
import { useAnimatedDragGesture } from './useAnimatedDragGesture'
import { useToastAnimations } from './useToastAnimations'
import { useReducedMotion } from './useReducedMotion'

// defaults
const VISIBLE_TOASTS_AMOUNT = 4
const VIEWPORT_OFFSET = 24
const TOAST_GAP = 14
const TOAST_LIFETIME = 4000
const TIME_BEFORE_UNMOUNT = 200
const DEFAULT_HOTKEY: string[] = ['altKey', 'KeyT']

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

// Map of toastId -> height (keyed storage prevents ordering drift)
type HeightsMap = Record<string | number, number>

interface ToastContextValue {
  toasts: ToastT[]
  heights: HeightsMap
  setToastHeight: (toastId: string | number, height: number) => void
  removeToastHeight: (toastId: string | number) => void
  expanded: boolean
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>
  interacting: boolean
  setInteracting: React.Dispatch<React.SetStateAction<boolean>>
  /** Trigger cooldown period after dismiss - prevents collapse during stack rebalance */
  triggerDismissCooldown: () => void
  /** Check if currently in dismiss cooldown */
  isInDismissCooldown: () => boolean
  removeToast: (toast: ToastT) => void
  position: ToastPosition
  duration: number
  gap: number
  visibleToasts: number
  swipeDirection: SwipeDirection
  swipeThreshold: number
  closeButton: boolean
  reducedMotion: boolean
  native: boolean
  burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>
  icons?: ToastIcons
}

const ToastContext = createStyledContext<ToastContextValue>(
  {} as ToastContextValue,
  'Toast__'
)

const useToastContext = ToastContext.useStyledContext

/* -------------------------------------------------------------------------------------------------
 * ToastItemContext - for auto-wiring Toast.Close
 * -----------------------------------------------------------------------------------------------*/

interface ToastItemContextValue {
  toast: ToastT
  handleClose: () => void
}

const ToastItemContext = React.createContext<ToastItemContextValue | null>(null)

function useToastItemContext() {
  const ctx = React.useContext(ToastItemContext)
  if (!ctx) {
    throw new Error('useToastItemContext must be used within Toast.Item or Toast.List')
  }
  return ctx
}

/* -------------------------------------------------------------------------------------------------
 * Icons
 * -----------------------------------------------------------------------------------------------*/

export interface ToastIcons {
  success?: React.ReactNode
  error?: React.ReactNode
  warning?: React.ReactNode
  info?: React.ReactNode
  loading?: React.ReactNode
  close?: React.ReactNode
}

/* Icons - users provide their own via icons prop, no built-in defaults */

const DefaultCloseIcon = () => (
  <SizableText size="$1" color="$color11">
    ✕
  </SizableText>
)

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
   * When true, toasts are always expanded (fanned out) instead of stacked.
   * @default false
   */
  expand?: boolean
  /**
   * Theme for toasts
   */
  theme?: 'light' | 'dark' | 'system'
  /**
   * Force reduced motion mode
   */
  reducedMotion?: boolean
  /**
   * When true, uses burnt native OS toasts on mobile instead of RN views.
   * @default false
   */
  native?: boolean
  /**
   * Options for burnt native toasts on mobile
   */
  burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>
  /**
   * Custom icons for toast types
   */
  icons?: ToastIcons
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
  function ToastRoot(props, _ref) {
    const {
      children,
      position = 'bottom-right',
      duration = TOAST_LIFETIME,
      gap = TOAST_GAP,
      visibleToasts = VISIBLE_TOASTS_AMOUNT,
      swipeDirection: swipeDirectionProp = 'auto',
      swipeThreshold = 50,
      closeButton = false,
      expand = false,
      theme: themeProp,
      reducedMotion: reducedMotionProp,
      native = false,
      burntOptions,
      icons,
    } = props

    const reducedMotion = useReducedMotion(reducedMotionProp)
    const [toasts, setToasts] = React.useState<ToastT[]>([])
    const [heights, setHeights] = React.useState<HeightsMap>({})
    const [localExpanded, setExpanded] = React.useState(false)
    const expanded = expand || localExpanded
    const [interacting, setInteracting] = React.useState(false)

    // Lock height updates during expand/collapse CSS transition to prevent
    // font-loading onLayout corrections from restarting the animation mid-flight.
    // useLayoutEffect fires before paint, so the lock is set before any onLayout callbacks.
    const heightsLockedRef = React.useRef(false)
    const prevExpandedRef = React.useRef(expanded)

    React.useLayoutEffect(() => {
      if (prevExpandedRef.current !== expanded) {
        heightsLockedRef.current = true
        prevExpandedRef.current = expanded
      }
      const timer = setTimeout(() => {
        heightsLockedRef.current = false
      }, 350)
      return () => clearTimeout(timer)
    }, [expanded])

    // Helper to set a single toast's height
    // Round + skip small changes to prevent cascading re-renders from
    // sub-pixel onLayout jitter during font loading or CSS transitions
    const setToastHeight = React.useCallback(
      (toastId: string | number, height: number) => {
        if (heightsLockedRef.current) return
        const rounded = Math.round(height)
        setHeights((prev) => {
          const existing = prev[toastId]
          if (existing != null && Math.abs(existing - rounded) <= 2) return prev
          return { ...prev, [toastId]: rounded }
        })
      },
      []
    )

    // Helper to remove a toast's height
    const removeToastHeight = React.useCallback((toastId: string | number) => {
      setHeights((prev) => {
        const next = { ...prev }
        delete next[toastId]
        return next
      })
    }, [])

    // Cooldown after dismiss - prevents collapse while stack rebalances
    const dismissCooldownRef = React.useRef(false)
    const dismissCooldownTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    )

    const triggerDismissCooldown = React.useCallback(() => {
      dismissCooldownRef.current = true
      if (dismissCooldownTimerRef.current) {
        clearTimeout(dismissCooldownTimerRef.current)
      }
      dismissCooldownTimerRef.current = setTimeout(() => {
        dismissCooldownRef.current = false
      }, 800)
    }, [])

    const isInDismissCooldown = React.useCallback(() => dismissCooldownRef.current, [])

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

    // collapse when 1 toast (but respect dismiss cooldown for smooth animation)
    React.useEffect(() => {
      if (toasts.length <= 1 && !dismissCooldownRef.current) {
        setExpanded(false)
      }
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
      setToastHeight,
      removeToastHeight,
      expanded,
      setExpanded,
      interacting,
      setInteracting,
      triggerDismissCooldown,
      isInDismissCooldown,
      removeToast,
      position,
      duration,
      gap,
      visibleToasts,
      swipeDirection,
      swipeThreshold,
      closeButton,
      reducedMotion,
      native,
      burntOptions,
      icons,
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
      hotkey = DEFAULT_HOTKEY,
      label = 'Notifications',
      portalToRoot = true,
      children,
      ...rest
    } = props

    const ctx = useToastContext()
    const listRef = React.useRef<TamaguiElement>(null)
    const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const hoverCooldownRef = React.useRef(false)
    const deferredCollapseRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

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
      else if (isWeb) {
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
      } else {
        styles.left = offsetObj.left ?? defaultOffset
        styles.right = offsetObj.right ?? defaultOffset
        styles.alignItems = 'center'
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
        {...(isWeb
          ? {
              onMouseEnter: () => {
                if (deferredCollapseRef.current) {
                  clearTimeout(deferredCollapseRef.current)
                  deferredCollapseRef.current = null
                }
                if (
                  ctx.toasts.length > 1 &&
                  !ctx.interacting &&
                  !hoverCooldownRef.current
                ) {
                  hoverTimeoutRef.current = setTimeout(() => ctx.setExpanded(true), 50)
                }
              },
              onMouseLeave: () => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current)
                  hoverTimeoutRef.current = null
                }
                if (!ctx.interacting && !ctx.isInDismissCooldown()) {
                  ctx.setExpanded(false)
                } else if (ctx.isInDismissCooldown()) {
                  // schedule collapse after cooldown expires
                  deferredCollapseRef.current = setTimeout(() => {
                    deferredCollapseRef.current = null
                    ctx.setExpanded(false)
                  }, 850)
                }
              },
              onPointerDown: () => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current)
                  hoverTimeoutRef.current = null
                }
                ctx.setInteracting(true)
              },
              onPointerUp: () => ctx.setInteracting(false),
              onPointerCancel: () => ctx.setInteracting(false),
            }
          : {
              onPress: () => {
                if (ctx.toasts.length > 1) {
                  ctx.setExpanded((prev) => !prev)
                }
              },
            })}
        {...rest}
      >
        {children}
      </ToastViewportFrame>
    )

    if (portalToRoot && isWeb) {
      return <Portal zIndex={100000}>{content}</Portal>
    }

    return content
  }
)

/* -------------------------------------------------------------------------------------------------
 * ToastList - handles iteration and AnimatePresence
 * -----------------------------------------------------------------------------------------------*/

export interface ToastItemRenderProps {
  toast: ToastT
  index: number
  handleClose: () => void
}

export interface ToastListProps {
  /**
   * Custom render function for each toast item
   */
  renderItem?: (props: ToastItemRenderProps) => React.ReactNode
}

function ToastList({ renderItem }: ToastListProps) {
  const ctx = useToastContext()

  return (
    <AnimatePresence>
      {ctx.toasts.map((toast, index) => {
        const handleClose = () => {
          if (toast.dismissible === false) return
          toast.onDismiss?.(toast)
          ctx.removeToast(toast)
        }

        const itemContextValue: ToastItemContextValue = {
          toast,
          handleClose,
        }

        // use default render if no custom renderItem
        if (!renderItem) {
          return (
            <ToastItemContext.Provider key={toast.id} value={itemContextValue}>
              <ToastItemInner toast={toast} index={index}>
                <DefaultToastContent toast={toast} />
              </ToastItemInner>
            </ToastItemContext.Provider>
          )
        }

        return (
          <ToastItemContext.Provider key={toast.id} value={itemContextValue}>
            {renderItem({ toast, index, handleClose })}
          </ToastItemContext.Provider>
        )
      })}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------------------------------
 * DefaultToastContent - default rendering for toast items
 * -----------------------------------------------------------------------------------------------*/

function DefaultToastContent({ toast }: { toast: ToastT }) {
  const ctx = useToastContext()
  const { handleClose } = useToastItemContext()
  const toastType = toast.type ?? 'default'

  const title = typeof toast.title === 'function' ? toast.title() : toast.title
  const description =
    typeof toast.description === 'function' ? toast.description() : toast.description

  return (
    <XStack alignItems="flex-start" gap="$3">
      <ToastIcon />

      <YStack flex={1} gap="$1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}

        {(toast.action || toast.cancel) && (
          <XStack gap="$2" marginTop="$2">
            {toast.cancel && (
              <ToastActionFrame
                backgroundColor="transparent"
                onPress={(e: any) => {
                  toast.cancel?.onClick?.(e)
                  handleClose()
                }}
              >
                <SizableText size="$2" color="$color11">
                  {toast.cancel.label}
                </SizableText>
              </ToastActionFrame>
            )}
            {toast.action && (
              <ToastActionFrame
                backgroundColor="$color12"
                hoverStyle={{ backgroundColor: '$color11' }}
                pressStyle={{ backgroundColor: '$color10' }}
                onPress={(e: any) => {
                  toast.action?.onClick?.(e)
                  if (!(e as any).defaultPrevented) {
                    handleClose()
                  }
                }}
              >
                <SizableText size="$2" fontWeight="600" color="$background">
                  {toast.action.label}
                </SizableText>
              </ToastActionFrame>
            )}
          </XStack>
        )}
      </YStack>

      {ctx.closeButton && <ToastClose />}
    </XStack>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ToastPositionWrapper - handles absolute positioning and stacking animations
 * -----------------------------------------------------------------------------------------------*/

const ToastPositionWrapper = styled(YStack, {
  name: 'ToastPositionWrapper',
  pointerEvents: 'auto',
  position: 'absolute',
  left: 0,
  right: 0,
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
 * DragWrapper - handles drag gestures with proper event handling
 * -----------------------------------------------------------------------------------------------*/

interface DragWrapperProps {
  animatedStyle: any
  gestureHandlers: any
  AnimatedView: any
  dragRef: React.RefObject<HTMLDivElement | null>
  children: React.ReactNode
}

function DragWrapper({
  animatedStyle,
  gestureHandlers,
  AnimatedView,
  dragRef,
  children,
}: DragWrapperProps) {
  if (isWeb) {
    return (
      <div
        ref={dragRef}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
          cursor: 'grab',
        }}
        {...gestureHandlers}
      >
        {children}
      </div>
    )
  }

  return (
    <AnimatedView style={[{ flex: 1 }, animatedStyle]} {...gestureHandlers}>
      {children}
    </AnimatedView>
  )
}

/* -------------------------------------------------------------------------------------------------
 * ToastItem (the wrapper with stacking/drag)
 * -----------------------------------------------------------------------------------------------*/

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
    const lastPauseTimeRef = React.useRef(0)
    const remainingTimeRef = React.useRef(toast.duration ?? ctx.duration)

    const isFront = index === 0
    const isVisible = index < ctx.visibleToasts
    const toastType = toast.type ?? 'default'
    const dismissible = toast.dismissible !== false
    const duration = toast.duration ?? ctx.duration

    const [yPosition] = ctx.position.split('-') as ['top' | 'bottom', string]
    const isTop = yPosition === 'top'

    // height tracking - iterate toasts in order for stable positioning
    const toastsHeightBefore = React.useMemo(() => {
      let total = 0
      for (let i = 0; i < index; i++) {
        const toastId = ctx.toasts[i]?.id
        if (toastId != null) {
          total += ctx.heights[toastId] ?? 55 // fallback height if not yet measured
        }
      }
      return total
    }, [ctx.toasts, ctx.heights, index])

    // timer
    const startTimer = React.useCallback(() => {
      if (duration === Number.POSITIVE_INFINITY || toastType === 'loading') return
      closeTimerStartRef.current = Date.now()
      closeTimerRef.current = setTimeout(() => {
        toast.onAutoClose?.(toast)
        setRemoved(true)
        setTimeout(() => ctx.removeToast(toast), TIME_BEFORE_UNMOUNT)
      }, remainingTimeRef.current)
    }, [duration, toastType, toast, ctx.removeToast])

    const pauseTimer = useEvent(() => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
      if (lastPauseTimeRef.current < closeTimerStartRef.current) {
        const elapsed = Date.now() - closeTimerStartRef.current
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
      }
      lastPauseTimeRef.current = Date.now()
    })

    const resumeTimer = useEvent(() => {
      startTimer()
    })

    React.useEffect(() => {
      setMounted(true)
    }, [])

    // handle burnt native toast on mobile
    React.useEffect(() => {
      if (ctx.native && !isWeb) {
        const titleText = typeof toast.title === 'function' ? toast.title() : toast.title
        const descText =
          typeof toast.description === 'function'
            ? toast.description()
            : toast.description

        if (typeof titleText === 'string') {
          createNativeToast(titleText, {
            message: typeof descText === 'string' ? descText : undefined,
            duration,
            burntOptions: ctx.burntOptions,
          })
        }
        // remove from state immediately — burnt handles display
        ctx.removeToast(toast)
      }
    }, [ctx.native])

    // handle deletion
    React.useEffect(() => {
      if (toast.delete) {
        setRemoved(true)
        setTimeout(() => {
          ctx.removeToast(toast)
        }, TIME_BEFORE_UNMOUNT)
      }
    }, [toast.delete, toast, ctx.removeToast])

    React.useEffect(() => {
      if (ctx.expanded || ctx.interacting) {
        pauseTimer()
      } else {
        startTimer()
      }
      return () => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      }
    }, [ctx.expanded, ctx.interacting, startTimer])

    // reset remaining time when duration changes
    React.useEffect(() => {
      remainingTimeRef.current = duration
    }, [duration])

    // animations
    const {
      setDragOffset,
      springBack,
      animateOut,
      animatedStyle,
      AnimatedView,
      dragRef,
    } = useToastAnimations({
      reducedMotion: ctx.reducedMotion,
      swipeAxis:
        ctx.swipeDirection === 'up' ||
        ctx.swipeDirection === 'down' ||
        ctx.swipeDirection === 'vertical'
          ? 'vertical'
          : 'horizontal',
    })

    const { isDragging, gestureHandlers } = useAnimatedDragGesture({
      direction: ctx.swipeDirection,
      threshold: ctx.swipeThreshold,
      disabled: !dismissible || toastType === 'loading',
      expanded: ctx.expanded,
      onDragStart: pauseTimer,
      onDragMove: setDragOffset,
      onDismiss: (exitDirection, velocity) => {
        // Trigger cooldown to prevent collapse while stack rebalances
        ctx.triggerDismissCooldown()
        setSwipeOut(true)
        toast.onDismiss?.(toast)
        setRemoved(true)
        animateOut(exitDirection, velocity, () => {
          // Just remove toast - unmount cleanup handles height removal
          ctx.removeToast(toast)
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
      (event: any) => {
        if (!ctx.expanded && index !== 0) return
        const { height } = event.nativeEvent.layout
        ctx.setToastHeight(toast.id, height)
      },
      [toast.id, ctx.setToastHeight, index, ctx.expanded]
    )

    // Remove height on unmount
    React.useEffect(() => {
      return () => {
        ctx.removeToastHeight(toast.id)
      }
    }, [toast.id, ctx.removeToastHeight])

    const handleClose = React.useCallback(() => {
      if (!dismissible) return
      toast.onDismiss?.(toast)
      setRemoved(true)
      setTimeout(() => ctx.removeToast(toast), TIME_BEFORE_UNMOUNT)
    }, [dismissible, toast, ctx.removeToast])

    const itemContextValue = React.useMemo<ToastItemContextValue>(
      () => ({ toast, handleClose }),
      [toast, handleClose]
    )

    // stacking calculations
    const frontToastId = ctx.toasts[0]?.id
    const frontToastHeight = frontToastId != null ? (ctx.heights[frontToastId] ?? 55) : 55
    const stackScale = !ctx.expanded && !isFront ? 1 - index * 0.05 : 1

    const expandedOffset = toastsHeightBefore + index * ctx.gap

    const stackY = ctx.expanded
      ? isTop
        ? expandedOffset
        : -expandedOffset
      : isFront
        ? 0
        : isTop
          ? ctx.gap * index
          : -ctx.gap * index

    // Entry offset: drives the slide-in animation through the same transition
    // as stack repositioning, so new toast and existing toasts animate in sync.
    // Uses mounted state (set in useEffect after first paint) — the 1-frame gap
    // lets the browser register the initial value before the CSS transition starts.
    const mountOffset = !mounted && !ctx.reducedMotion ? (isTop ? -80 : 80) : 0

    const computedOpacity =
      !mounted && !ctx.reducedMotion
        ? 0
        : removed && !swipeOut
          ? 0
          : index >= ctx.visibleToasts
            ? 0
            : !ctx.expanded && index === ctx.visibleToasts - 1
              ? 0.5
              : 1
    const computedZIndex = removed ? 0 : ctx.visibleToasts - index + 1
    const computedHeight = !ctx.expanded && !isFront ? frontToastHeight : undefined
    const computedPointerEvents = index >= ctx.visibleToasts ? 'none' : 'auto'

    // gap filler for hover stability
    const gapFillerHeight = ctx.expanded ? ctx.gap + 1 : 0

    // data attributes
    const dataAttributes = {
      'data-mounted': mounted ? 'true' : 'false',
      'data-removed': removed ? 'true' : 'false',
      'data-swipe-out': swipeOut ? 'true' : 'false',
      'data-visible': isVisible ? 'true' : 'false',
      'data-front': isFront ? 'true' : 'false',
      'data-index': String(index),
      'data-type': toastType,
      'data-expanded': ctx.expanded ? 'true' : 'false',
    }

    return (
      <ToastPositionWrapper
        ref={ref}
        testID={rest.testID}
        accessibilityLabel={rest.accessibilityLabel}
        {...dataAttributes}
        transition={isDragging || ctx.reducedMotion ? undefined : '400ms'}
        animateOnly={['transform', 'opacity', 'height']}
        y={stackY + mountOffset}
        scale={stackScale}
        opacity={computedOpacity}
        zIndex={computedZIndex}
        height={computedHeight}
        overflow="visible"
        pointerEvents={computedPointerEvents as any}
        top={isTop ? 0 : undefined}
        bottom={isTop ? undefined : 0}
        {...(isWeb &&
          !isFront && {
            style: { transformOrigin: isTop ? 'top center' : 'bottom center' },
          })}
        enterStyle={ctx.reducedMotion ? { opacity: 0 } : undefined}
        exitStyle={
          ctx.reducedMotion
            ? { opacity: 0 }
            : swipeOut
              ? { opacity: 0, x: 0, y: 0, scale: 1 }
              : { opacity: 0, y: stackY, scale: stackScale }
        }
      >
        <DragWrapper
          animatedStyle={animatedStyle}
          gestureHandlers={gestureHandlers}
          AnimatedView={AnimatedView}
          dragRef={dragRef}
        >
          <ToastItemFrame
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
            {...rest}
          >
            {/* gap filler to prevent hover flicker */}
            {ctx.expanded && gapFillerHeight > 0 && (
              <View
                position="absolute"
                left={0}
                right={0}
                height={gapFillerHeight}
                pointerEvents="auto"
                {...(isTop ? { top: '100%' } : { bottom: '100%' })}
              />
            )}
            <ToastItemContext.Provider value={itemContextValue}>
              {children}
            </ToastItemContext.Provider>
          </ToastItemFrame>
        </DragWrapper>
      </ToastPositionWrapper>
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
 * ToastClose - auto-wired to dismiss current toast
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
        borderRadius: '$10',
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

const ToastClose = ToastCloseFrame.styleable(function ToastClose(props, ref) {
  // try to get handleClose from context, but allow manual override
  let handleClose: (() => void) | undefined
  try {
    const itemCtx = useToastItemContext()
    handleClose = itemCtx.handleClose
  } catch {
    // not inside a Toast.Item context, require manual onPress
  }

  const ctx = useToastContext()

  return (
    <ToastCloseFrame ref={ref} aria-label="Close toast" onPress={handleClose} {...props}>
      {props.children ?? ctx.icons?.close ?? <DefaultCloseIcon />}
    </ToastCloseFrame>
  )
})

/* -------------------------------------------------------------------------------------------------
 * ToastAction
 * -----------------------------------------------------------------------------------------------*/

const ToastActionFrame = styled(XStack, {
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

const ToastAction = ToastActionFrame.styleable(function ToastAction(props, ref) {
  return <ToastActionFrame ref={ref} {...props} />
})

/* -------------------------------------------------------------------------------------------------
 * ToastIcon - renders icon based on toast type
 * -----------------------------------------------------------------------------------------------*/

function ToastIcon(props: { children?: React.ReactNode }) {
  const ctx = useToastContext()
  let toast: ToastT | undefined

  try {
    const itemCtx = useToastItemContext()
    toast = itemCtx.toast
  } catch {
    // not inside a Toast.Item context
    return null
  }

  if (!toast) return null

  // if custom icon provided on toast, use it
  if (toast.icon !== undefined) {
    return (
      <View flexShrink={0} marginTop="$0.5">
        {toast.icon}
      </View>
    )
  }

  const toastType = toast.type ?? 'default'

  // only show icons if explicitly provided via icons prop (no built-in defaults)
  const icon = ctx.icons?.[toastType] ?? null
  if (!icon) return null

  return (
    <View flexShrink={0} marginTop="$0.5">
      {icon}
    </View>
  )
}

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
 * useToastItem hook for accessing current toast in custom content
 * -----------------------------------------------------------------------------------------------*/

export function useToastItem() {
  return useToastItemContext()
}

/* -------------------------------------------------------------------------------------------------
 * Export
 * -----------------------------------------------------------------------------------------------*/

ToastRoot.displayName = 'Toast'

export const Toast = withStaticProperties(ToastRoot, {
  Viewport: ToastViewport,
  List: ToastList,
  Item: ToastItemInner,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
  Action: ToastAction,
  Icon: ToastIcon,
})

export type { ToastT, ExternalToast }
