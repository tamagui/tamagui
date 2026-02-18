import { AnimatePresence } from '@tamagui/animate-presence'
import { isWeb } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { Theme, View, styled, useThemeName } from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import * as React from 'react'
import { createNativeToast } from './createNativeToast'
import { ToastItem } from './ToastItem'
import type { SwipeDirection } from './ToastProvider'
import type { ExternalToast, ToastT, ToastToDismiss } from './ToastState'
import { ToastState } from './ToastState'
import type { BurntToastOptions } from './types'
import { useReducedMotion } from './useReducedMotion'

// defaults
const VISIBLE_TOASTS_AMOUNT = 4
const VIEWPORT_OFFSET = 24
const TOAST_GAP = 14
const TOAST_LIFETIME = 4000
const DEFAULT_HOTKEY: string[] = ['altKey', 'KeyT']

/**
 * Resolves 'auto' swipe direction based on toast position.
 * Swipe toward the nearest edge to dismiss.
 */
function resolveSwipeDirection(
  direction: SwipeDirection,
  position: ToasterPosition
): Exclude<SwipeDirection, 'auto'> {
  if (direction !== 'auto') {
    return direction
  }

  // parse position to determine edges
  const [yPosition, xPosition] = position.split('-') as [
    'top' | 'bottom',
    'left' | 'center' | 'right',
  ]

  // for left/right positions, swipe horizontally toward that edge
  if (xPosition === 'left') return 'left'
  if (xPosition === 'right') return 'right'

  // for center positions, swipe vertically toward the y edge
  return yPosition === 'top' ? 'up' : 'down'
}

export type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/** @deprecated Use HeightsMap instead */
export interface HeightT {
  toastId: string | number
  height: number
  position?: ToasterPosition
}

// Map of toastId -> height (keyed storage prevents ordering drift)
type HeightsMap = Record<string | number, number>

const TOAST_WIDTH = 356

const ToasterFrame = styled(View, {
  name: 'Toaster',

  variants: {
    unstyled: {
      false: {
        position: isWeb ? ('fixed' as any) : 'absolute',
        zIndex: 100000,
        pointerEvents: 'box-none',
        maxWidth: '100%',
        width: TOAST_WIDTH,
        minHeight: 1,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

export interface ToasterProps {
  /**
   * Position of the toasts on screen
   * @default 'bottom-right'
   */
  position?: ToasterPosition

  /**
   * Width of toast container in pixels
   * @default 356
   */
  width?: number

  /**
   * Expand toasts on hover to show all
   * @default false
   */
  expand?: boolean

  /**
   * Number of toasts visible at once
   * @default 4
   */
  visibleToasts?: number

  /**
   * Gap between toasts in pixels
   * @default 14
   */
  gap?: number

  /**
   * Default duration for toasts in ms
   * @default 4000
   */
  duration?: number

  /**
   * Offset from screen edge in pixels
   * @default 24
   */
  offset?: number | { top?: number; right?: number; bottom?: number; left?: number }

  /**
   * Hotkey to focus toast viewport
   * @default ['altKey', 'KeyT']
   */
  hotkey?: string[]

  /**
   * Direction(s) toasts can be swiped to dismiss.
   * 'auto' detects based on position (swipe toward nearest edge).
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
   * Theme for toasts (auto-detected if not set)
   */
  theme?: 'light' | 'dark' | 'system'

  /**
   * Custom icons for toast types
   */
  icons?: {
    success?: React.ReactNode
    error?: React.ReactNode
    warning?: React.ReactNode
    info?: React.ReactNode
    loading?: React.ReactNode
    close?: React.ReactNode
  }

  /**
   * Default toast options
   */
  toastOptions?: ExternalToast

  /**
   * Container aria label for screen readers
   * @default 'Notifications'
   */
  containerAriaLabel?: string

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
   * Options for web Notification API
   */
  notificationOptions?: NotificationOptions

  /**
   * Custom className for the container
   */
  className?: string

  /**
   * Custom style for the container
   */
  style?: React.CSSProperties

  /**
   * Force reduced motion mode (disables animations)
   * When true, animations are disabled. When false, animations are enabled.
   * When undefined, respects system preference (prefers-reduced-motion).
   */
  reducedMotion?: boolean
}

export const Toaster = React.forwardRef<TamaguiElement, ToasterProps>(
  function Toaster(props, _ref) {
    const {
      position = 'bottom-right',
      width = TOAST_WIDTH,
      expand = false,
      visibleToasts = VISIBLE_TOASTS_AMOUNT,
      gap = TOAST_GAP,
      duration = TOAST_LIFETIME,
      offset = VIEWPORT_OFFSET,
      hotkey = DEFAULT_HOTKEY,
      swipeDirection = 'auto',
      swipeThreshold = 50,
      closeButton = false,
      theme: themeProp,
      icons,
      toastOptions,
      containerAriaLabel = 'Notifications',
      native = false,
      burntOptions,
      notificationOptions,
      className,
      style,
      reducedMotion: reducedMotionProp,
    } = props

    // detect reduced motion preference
    const reducedMotion = useReducedMotion(reducedMotionProp)

    const [toasts, setToasts] = React.useState<ToastT[]>([])
    const [heights, setHeights] = React.useState<HeightsMap>({})

    // Lock height updates during expand/collapse CSS transition to prevent
    // font-loading onLayout corrections from restarting the animation mid-flight.
    const heightsLockedRef = React.useRef(false)

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

    const removeToastHeight = React.useCallback((toastId: string | number) => {
      setHeights((prev) => {
        const next = { ...prev }
        delete next[toastId]
        return next
      })
    }, [])

    const [localExpanded, setExpanded] = React.useState(false)
    const expanded = expand || localExpanded
    const [interacting, setInteracting] = React.useState(false)

    // useLayoutEffect fires before paint, so the lock is set before any onLayout callbacks
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

    const listRef = React.useRef<TamaguiElement>(null)
    const lastFocusedElementRef = React.useRef<HTMLElement | null>(null)
    const isFocusWithinRef = React.useRef(false)
    const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const hoverCooldownRef = React.useRef(false)
    const dismissCooldownRef = React.useRef(false)
    const dismissCooldownTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    )
    const deferredCollapseRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    // Refs so the stable subscriber closure can read latest prop values
    const nativeRef = React.useRef(native)
    nativeRef.current = native
    const burntOptionsRef = React.useRef(burntOptions)
    burntOptionsRef.current = burntOptions
    const notificationOptionsRef = React.useRef(notificationOptions)
    notificationOptionsRef.current = notificationOptions
    const toastsRef = React.useRef(toasts)
    toastsRef.current = toasts

    // subscribe to toast state changes
    React.useEffect(() => {
      return ToastState.subscribe((toast) => {
        if ((toast as ToastToDismiss).dismiss) {
          // mark toast for deletion animation
          setToasts((toasts) =>
            toasts.map((t) => (t.id === toast.id ? { ...t, delete: true } : t))
          )
          return
        }

        // Native dispatch: intercept NEW toasts before they enter React state
        const isNew = !toastsRef.current.some((t) => t.id === toast.id)
        if (isNew && nativeRef.current) {
          const t = toast as ToastT
          const titleText = typeof t.title === 'function' ? t.title() : t.title
          const descText =
            typeof t.description === 'function' ? t.description() : t.description
          if (typeof titleText === 'string') {
            const result = createNativeToast(titleText, {
              message: typeof descText === 'string' ? descText : undefined,
              duration: t.duration,
              burntOptions: t.burntOptions ?? burntOptionsRef.current,
              notificationOptions:
                t.notificationOptions ?? notificationOptionsRef.current,
            })
            if (result !== false) {
              return // native handled — skip in-app
            }
          }
        }

        // add or update toast
        setToasts((toasts) => {
          const indexOfExistingToast = toasts.findIndex((t) => t.id === toast.id)

          if (indexOfExistingToast !== -1) {
            // update existing
            return [
              ...toasts.slice(0, indexOfExistingToast),
              { ...toasts[indexOfExistingToast], ...toast },
              ...toasts.slice(indexOfExistingToast + 1),
            ]
          }

          // add new toast at the beginning
          return [toast as ToastT, ...toasts]
        })
      })
    }, [])

    // collapse expanded view when only 1 toast remains (respect dismiss cooldown)
    React.useEffect(() => {
      if (toasts.length <= 1 && !dismissCooldownRef.current) {
        setExpanded(false)
      }
    }, [toasts.length])

    // keyboard hotkey handler
    React.useEffect(() => {
      if (!isWeb) return

      const handleKeyDown = (event: KeyboardEvent) => {
        const isHotkeyPressed =
          hotkey.length > 0 &&
          hotkey.every((key) => (event as any)[key] || event.code === key)

        if (isHotkeyPressed) {
          setExpanded(true)
          ;(listRef.current as HTMLElement)?.focus()
        }

        if (
          event.code === 'Escape' &&
          (document.activeElement === listRef.current ||
            (listRef.current as HTMLElement)?.contains(document.activeElement))
        ) {
          setExpanded(false)
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [hotkey])

    // restore focus when toaster unmounts
    React.useEffect(() => {
      if (!isWeb || !listRef.current) return

      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({ preventScroll: true })
          lastFocusedElementRef.current = null
          isFocusWithinRef.current = false
        }
      }
    }, [])

    // cleanup hover timeout on unmount
    React.useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
      }
    }, [])

    const triggerDismissCooldown = React.useCallback(() => {
      dismissCooldownRef.current = true
      if (dismissCooldownTimerRef.current) {
        clearTimeout(dismissCooldownTimerRef.current)
      }
      dismissCooldownTimerRef.current = setTimeout(() => {
        dismissCooldownRef.current = false
      }, 800)
    }, [])

    const removeToast = React.useCallback((toastToRemove: ToastT) => {
      setToasts((toasts) => {
        if (!toasts.find((toast) => toast.id === toastToRemove.id)?.delete) {
          ToastState.dismiss(toastToRemove.id)
        }
        return toasts.filter(({ id }) => id !== toastToRemove.id)
      })
    }, [])

    // parse position
    const [yPosition, xPosition] = position.split('-') as [
      'top' | 'bottom',
      'left' | 'center' | 'right',
    ]

    // offset styles — matches composable API pattern exactly
    // applied via style prop so it overrides styled defaults (e.g. width) on native
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

    // get current theme
    const currentTheme = useThemeName()
    const resolvedTheme =
      themeProp === 'system' || !themeProp
        ? currentTheme?.includes('dark')
          ? 'dark'
          : 'light'
        : themeProp

    const hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')

    if (toasts.length === 0) {
      return null
    }

    const content = (
      <ToasterFrame
        ref={listRef}
        aria-label={`${containerAriaLabel} ${hotkeyLabel}`}
        tabIndex={-1}
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic={false}
        style={style ? { ...offsetStyles, ...style } : offsetStyles}
        className={className}
        data-y-position={yPosition}
        data-x-position={xPosition}
        {...(isWeb
          ? {
              onMouseEnter: () => {
                if (deferredCollapseRef.current) {
                  clearTimeout(deferredCollapseRef.current)
                  deferredCollapseRef.current = null
                }
                if (toasts.length > 1 && !interacting && !hoverCooldownRef.current) {
                  hoverTimeoutRef.current = setTimeout(() => {
                    setExpanded(true)
                  }, 50)
                }
              },
              onMouseMove: () => {
                if (
                  toasts.length > 1 &&
                  !interacting &&
                  !expanded &&
                  !hoverCooldownRef.current
                ) {
                  if (!hoverTimeoutRef.current) {
                    hoverTimeoutRef.current = setTimeout(() => {
                      setExpanded(true)
                    }, 50)
                  }
                }
              },
              onMouseLeave: () => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current)
                  hoverTimeoutRef.current = null
                }
                if (!interacting && !dismissCooldownRef.current) {
                  setExpanded(false)
                } else if (dismissCooldownRef.current) {
                  deferredCollapseRef.current = setTimeout(() => {
                    deferredCollapseRef.current = null
                    setExpanded(false)
                  }, 850)
                }
              },
              onPointerDown: () => {
                if (hoverTimeoutRef.current) {
                  clearTimeout(hoverTimeoutRef.current)
                  hoverTimeoutRef.current = null
                }
                setInteracting(true)
              },
              onPointerUp: () => setInteracting(false),
              onPointerCancel: () => setInteracting(false),
            }
          : {
              onPress: () => {
                if (toasts.length > 1) {
                  setExpanded((prev) => !prev)
                }
              },
            })}
        {...(isWeb && {
          onBlur: (event: React.FocusEvent) => {
            if (
              isFocusWithinRef.current &&
              !(event.currentTarget as HTMLElement).contains(
                event.relatedTarget as HTMLElement
              )
            ) {
              isFocusWithinRef.current = false
              if (lastFocusedElementRef.current) {
                lastFocusedElementRef.current.focus({ preventScroll: true })
                lastFocusedElementRef.current = null
              }
            }
          },
          onFocus: (event: React.FocusEvent) => {
            if (!isFocusWithinRef.current) {
              isFocusWithinRef.current = true
              lastFocusedElementRef.current = event.relatedTarget as HTMLElement
            }
          },
        })}
      >
        <AnimatePresence>
          {toasts.map((toast, index) => {
            const isVisible = index < visibleToasts
            const isFront = index === 0

            // calculate sum of heights of all toasts BEFORE this one
            // toasts[0..index-1] are rendered before this toast (visually above it for bottom position)
            const heightBeforeMe = toasts.slice(0, index).reduce((sum, t) => {
              return sum + (heights[t.id] ?? 55)
            }, 0)

            return (
              <ToastItem
                key={toast.id}
                toast={toast}
                index={index}
                expanded={expanded}
                interacting={interacting}
                position={position}
                visibleToasts={visibleToasts}
                removeToast={removeToast}
                triggerDismissCooldown={triggerDismissCooldown}
                heights={heights}
                setToastHeight={setToastHeight}
                removeToastHeight={removeToastHeight}
                heightBeforeMe={heightBeforeMe}
                frontToastHeight={toasts[0] ? (heights[toasts[0].id] ?? 55) : 55}
                duration={toast.duration ?? toastOptions?.duration ?? duration}
                gap={gap}
                swipeDirection={resolveSwipeDirection(swipeDirection, position)}
                swipeThreshold={swipeThreshold}
                closeButton={toast.closeButton ?? closeButton}
                icons={icons}
                reducedMotion={reducedMotion}
              />
            )
          })}
        </AnimatePresence>
      </ToasterFrame>
    )

    // on web, render in a portal
    if (isWeb) {
      return (
        <Portal>
          <Theme name={resolvedTheme as any}>{content}</Theme>
        </Portal>
      )
    }

    return <Theme name={resolvedTheme as any}>{content}</Theme>
  }
)

Toaster.displayName = 'Toaster'
