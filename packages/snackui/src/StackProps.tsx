import { RefObject } from 'react'
import { GestureResponderEvent, View, ViewProps, ViewStyle } from 'react-native'

import { Spacing } from './views/Spacer'

export type EnhancedStyleProps = Omit<ViewStyle, 'display' | 'backfaceVisibility'> &
  TransformStyleProps & {
    cursor?: string
    contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string
    display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
  }

export type StackProps = EnhancedStyleProps &
  Omit<ViewProps, 'display'> & {
    ref?: RefObject<View | HTMLElement> | ((node: View | HTMLElement) => any)
    animated?: boolean
    fullscreen?: boolean
    children?: any
    hoverStyle?: EnhancedStyleProps | null
    pressStyle?: EnhancedStyleProps | null
    onHoverIn?: (e: MouseEvent) => any
    onHoverOut?: (e: MouseEvent) => any
    onPress?: (e: GestureResponderEvent) => any
    onPressIn?: (e: GestureResponderEvent) => any
    onPressOut?: (e: GestureResponderEvent) => any
    onMouseEnter?: (e: GestureResponderEvent) => any
    onMouseLeave?: (e: GestureResponderEvent) => any
    spacing?: Spacing
    pointerEvents?: string
    userSelect?: string
    className?: string
    disabled?: boolean
  }

export type TransformStyleProps = {
  x?: number
  y?: number
  perspective?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  skewX?: string
  skewY?: string
  matrix?: number[]
  rotate?: string
  rotateY?: string
  rotateX?: string
  rotateZ?: string
}
