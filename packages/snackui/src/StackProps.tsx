import { RefObject } from 'react'
import { GestureResponderEvent, View, ViewProps, ViewStyle } from 'react-native'

import { Spacing } from './views/Spacer'

type EnhancedStyleProps = Omit<ViewStyle, 'display'> & TransformStyleProps

export type StackProps = Omit<
  EnhancedStyleProps &
    Omit<ViewProps, 'display'> & {
      ref?: RefObject<View | HTMLElement> | ((node: View | HTMLElement) => any)
      animated?: boolean
      fullscreen?: boolean
      children?: any
      hoverStyle?: EnhancedStyleProps | null
      pressStyle?: EnhancedStyleProps | null
      // focusStyle?: ViewStyle | null
      onHoverIn?: (e: MouseEvent) => any
      onHoverOut?: (e: MouseEvent) => any
      onPress?: (e: GestureResponderEvent) => any
      onPressIn?: (e: GestureResponderEvent) => any
      onPressOut?: (e: GestureResponderEvent) => any
      spacing?: Spacing
      cursor?: string
      pointerEvents?: string
      userSelect?: string
      className?: string
      // stronger version of pointer-events: none;
      disabled?: boolean
      contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string
      display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
    },
  // because who tf uses backfaceVisibility
  'backfaceVisibility'
>

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
