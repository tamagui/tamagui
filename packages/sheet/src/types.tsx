import { ScopedProps } from '@tamagui/create-context'
import { RemoveScroll } from '@tamagui/remove-scroll'
import React, { ReactNode } from 'react'
import { Animated } from 'react-native'

export type SheetProps = ScopedProps<
  {
    open?: boolean
    defaultOpen?: boolean
    onChangeOpen?: OpenChangeHandler
    position?: number
    defaultPosition?: number
    snapPoints?: number[]
    onChangePosition?: PositionChangeHandler
    children?: ReactNode
    dismissOnOverlayPress?: boolean
    dismissOnSnapToBottom?: boolean
    animationConfig?: Animated.SpringAnimationConfig
    handleDisableScroll?: boolean
    disableDrag?: boolean
    modal?: boolean
  },
  'Sheet'
>

export type PositionChangeHandler = (position: number) => void

type OpenChangeHandler = ((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>

export type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>

export type SheetScopedProps<A> = ScopedProps<A, 'Sheet'>

export type ScrollBridge = {
  enabled: boolean
  y: number
  paneY: number
  paneMinY: number
  scrollStartY: number
  drag: (dy: number) => void
  release: (state: { dy: number; vy: number }) => void
  scrollLock: boolean
  onFinishAnimate?: () => void
}
