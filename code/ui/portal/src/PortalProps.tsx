import { ViewProps } from '@tamagui/web/types'
import type { StackZIndexProp } from '@tamagui/z-index-stack'
import { CSSProperties, ReactNode } from 'react'

export type PortalProps = {
  zIndex?: ViewProps['zIndex']
  passThrough?: boolean
  stackZIndex?: StackZIndexProp
  children?: ReactNode
  style?: CSSProperties

  /**
   * Optional property just to indicate open and enable pointer-events
   */
  open?: boolean

  /**
   * Web only: sets visibility:hidden on the portal host. Pass while the
   * content is closed and not animating out - iOS 26 Safari otherwise samples
   * the invisible full-viewport host to color the status-bar area white.
   */
  hidden?: boolean
}
