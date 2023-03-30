import { AnimatedNumberStrategy, AnimationProp } from '@tamagui/core'
import type { ScopedProps } from '@tamagui/create-context'
import type { PortalProps } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import React, { ReactNode } from 'react'

export type SheetProps = ScopedProps<
  {
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: OpenChangeHandler
    position?: number
    defaultPosition?: number
    snapPoints?: number[]
    onPositionChange?: PositionChangeHandler
    children?: ReactNode
    dismissOnOverlayPress?: boolean
    dismissOnSnapToBottom?: boolean
    forceRemoveScrollEnabled?: boolean
    animationConfig?: AnimatedNumberStrategy
    /**
     * Pass if you're using the CSS animation driver
     */
    animation?: AnimationProp
    handleDisableScroll?: boolean
    disableDrag?: boolean
    modal?: boolean
    zIndex?: number
    portalProps?: PortalProps
    disableKeyboardMove?: boolean
  },
  'Sheet'
>

export type PositionChangeHandler = (position: number) => void

type OpenChangeHandler =
  | ((open: boolean) => void)
  | React.Dispatch<React.SetStateAction<boolean>>

export type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>

export type SheetScopedProps<A> = ScopedProps<A, 'Sheet'>

export type ScrollBridge = {
  enabled: boolean
  y: number
  paneY: number
  paneMinY: number
  scrollStartY: number
  drag: (dy: number) => void
  release: (state: { dragAt: number; vy: number }) => void
  scrollLock: boolean
  onFinishAnimate?: () => void
}
