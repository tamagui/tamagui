import { AnimatePresence } from '@tamagui/animate-presence'
import { isWeb } from '@tamagui/constants'
import type { TamaguiElement } from '@tamagui/core'
import { Theme, View, styled, useThemeName } from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import * as React from 'react'
import { ToastItem } from './ToastItem'
import type { SwipeDirection } from './ToastProvider'
import type { ExternalToast, ToastT, ToastToDismiss } from './ToastState'
import { ToastState } from './ToastState'
import type { BurntToastOptions } from './types'

// defaults
const VISIBLE_TOASTS_AMOUNT = 4
const VIEWPORT_OFFSET = 24
const TOAST_GAP = 14
const TOAST_LIFETIME = 4000

export type ToasterPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface HeightT {
  toastId: string | number
  height: number
  position?: ToasterPosition
}

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
        // need min-height to contain absolutely positioned toasts
        // toasts will overflow upward/downward from their anchor position
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
   * Direction(s) toasts can be swiped to dismiss
   * @default 'right'
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
   * Disable native toast on mobile (uses burnt package)
   * @default false
   */
  disableNative?: boolean

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
      hotkey = ['altKey', 'KeyT'],
      swipeDirection = 'right',
      swipeThreshold = 50,
      closeButton = false,
      theme: themeProp,
      icons,
      toastOptions,
      containerAriaLabel = 'Notifications',
      disableNative = false,
      burntOptions,
      notificationOptions,
      className,
      style,
    } = props

    const [toasts, setToasts] = React.useState<ToastT[]>([])
    const [heights, setHeights] = React.useState<HeightT[]>([])
    const [expanded, setExpanded] = React.useState(false)
    const [interacting, setInteracting] = React.useState(false)
    const [isPointerDown, setIsPointerDown] = React.useState(false)

    const listRef = React.useRef<TamaguiElement>(null)
    const lastFocusedElementRef = React.useRef<HTMLElement | null>(null)
    const isFocusWithinRef = React.useRef(false)

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

    // collapse expanded view when only 1 active (non-deleted) toast remains
    const activeToastCount = toasts.filter((t) => !t.delete).length
    React.useEffect(() => {
      if (activeToastCount <= 1) {
        setExpanded(false)
      }
    }, [activeToastCount])

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

    // global pointer up listener to catch releases outside container
    // prevents isPointerDown from getting stuck true
    React.useEffect(() => {
      if (!isWeb || !isPointerDown) return

      const handleGlobalPointerUp = () => {
        setIsPointerDown(false)
        setInteracting(false)
        setExpanded(false)
      }

      document.addEventListener('pointerup', handleGlobalPointerUp)
      return () => document.removeEventListener('pointerup', handleGlobalPointerUp)
    }, [isPointerDown])

    // clean up all deleted toasts after exit animations complete
    const handleExitComplete = React.useCallback(() => {
      setToasts((currentToasts) => {
        // get IDs of toasts being removed
        const deletedIds = currentToasts.filter((t) => t.delete).map((t) => t.id)
        // clean up each deleted toast from ToastState
        deletedIds.forEach((id) => ToastState.cleanup(id))
        // remove from local state
        return currentToasts.filter((t) => !t.delete)
      })
    }, [])

    // parse position
    const [yPosition, xPosition] = position.split('-') as [
      'top' | 'bottom',
      'left' | 'center' | 'right',
    ]

    // calculate offset styles
    const offsetStyles = React.useMemo(() => {
      const styles: React.CSSProperties = {}

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

      if (yPosition === 'top') {
        styles.top = offsetObj.top ?? defaultOffset
      } else {
        styles.bottom = offsetObj.bottom ?? defaultOffset
      }

      if (xPosition === 'left') {
        styles.left = offsetObj.left ?? defaultOffset
      } else if (xPosition === 'right') {
        styles.right = offsetObj.right ?? defaultOffset
      } else {
        // center
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
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

    // only return null if there are no toasts at all (including ones being animated out)
    // we keep the container mounted while exit animations play
    if (toasts.length === 0) {
      return null
    }

    const content = (
      <ToasterFrame
        ref={listRef}
        width={width}
        aria-label={`${containerAriaLabel} ${hotkeyLabel}`}
        tabIndex={-1}
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic={false}
        style={{ ...offsetStyles, ...style }}
        className={className}
        data-y-position={yPosition}
        data-x-position={xPosition}
        onMouseEnter={() => setExpanded(true)}
        onMouseMove={() => setExpanded(true)}
        onMouseLeave={() => {
          // only collapse if not actively dragging (pointer down outside container)
          // this prevents mid-interaction collapse when dragging outside
          if (!isPointerDown) {
            setInteracting(false)
            setExpanded(false)
          }
        }}
        onPointerDown={() => {
          setInteracting(true)
          setIsPointerDown(true)
        }}
        onPointerUp={() => {
          setIsPointerDown(false)
        }}
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
        <AnimatePresence onExitComplete={handleExitComplete}>
          {toasts.map((toast) => {
            // calculate index among non-deleted toasts for stacking
            const visibleIndex = toasts
              .filter((t) => !t.delete)
              .findIndex((t) => t.id === toast.id)

            // skip rendering deleted toasts - AnimatePresence will animate exit
            // for toasts that are still visible
            if (toast.delete) return null

            return (
              <ToastItem
                key={toast.id}
                toast={toast}
                index={visibleIndex === -1 ? 0 : visibleIndex}
                expanded={expanded || expand}
                interacting={interacting}
                position={position}
                visibleToasts={visibleToasts}
                heights={heights}
                setHeights={setHeights}
                duration={toast.duration ?? toastOptions?.duration ?? duration}
                gap={gap}
                swipeDirection={swipeDirection}
                swipeThreshold={swipeThreshold}
                closeButton={toast.closeButton ?? closeButton}
                icons={icons}
                disableNative={disableNative}
                burntOptions={burntOptions}
                notificationOptions={notificationOptions}
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
