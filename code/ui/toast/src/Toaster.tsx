/**
 * Toaster — drop-in all-in-one toast component.
 * Thin wrapper around Toast + Toast.Viewport + Toast.List (composable API).
 */

import type { TamaguiElement } from '@tamagui/core'
import * as React from 'react'
import { Toast } from './ToastComposable'
import type { ToastPosition } from './ToastComposable'
import type { SwipeDirection } from './ToastProvider'
import type { ExternalToast } from './ToastState'
import type { BurntToastOptions } from './types'

export type ToasterPosition = ToastPosition

export interface ToasterProps {
  /**
   * Position of the toasts on screen
   * @default 'bottom-right'
   */
  position?: ToasterPosition

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
   * Force reduced motion mode (disables animations)
   */
  reducedMotion?: boolean
}

export const Toaster = React.forwardRef<TamaguiElement, ToasterProps>(
  function Toaster(props, ref) {
    const {
      position = 'bottom-right',
      expand = false,
      visibleToasts,
      gap,
      duration,
      offset,
      hotkey,
      swipeDirection,
      swipeThreshold,
      closeButton,
      theme,
      icons,
      toastOptions,
      containerAriaLabel = 'Notifications',
      native,
      burntOptions,
      notificationOptions,
      reducedMotion,
    } = props

    return (
      <Toast
        position={position}
        expand={expand}
        visibleToasts={visibleToasts}
        gap={gap}
        duration={toastOptions?.duration ?? duration}
        swipeDirection={swipeDirection}
        swipeThreshold={swipeThreshold}
        closeButton={closeButton}
        theme={theme}
        icons={icons}
        native={native}
        burntOptions={burntOptions}
        notificationOptions={notificationOptions}
        reducedMotion={reducedMotion}
      >
        <Toast.Viewport
          ref={ref}
          offset={offset}
          hotkey={hotkey}
          label={containerAriaLabel}
        >
          <Toast.List />
        </Toast.Viewport>
      </Toast>
    )
  }
)

Toaster.displayName = 'Toaster'
