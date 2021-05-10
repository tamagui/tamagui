import { RefObject } from 'react'
import { GestureResponderEvent, View, ViewProps, ViewStyle } from 'react-native'

import { Spacing } from './views/Spacer'

export type EnhancedStyleProps = Omit<ViewStyle, 'display' | 'backfaceVisibility'> &
  TransformStyleProps & {
    cursor?: string
    contain?: 'none' | 'strict' | 'content' | 'size' | 'layout' | 'paint' | string
    display?: 'inherit' | 'none' | 'inline' | 'block' | 'contents' | 'flex' | 'inline-flex'
  }

export type StackProps = Omit<RNWInternalProps, 'onLayout'> &
  EnhancedStyleProps &
  Omit<ViewProps, 'display' | 'onLayout'> & {
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

type RNWInternalProps = {
  accessibilityState?: {
    busy?: boolean
    checked?: boolean | 'mixed'
    disabled?: boolean
    expanded?: boolean
    grabbed?: boolean
    hidden?: boolean
    invalid?: boolean
    modal?: boolean
    pressed?: boolean
    readonly?: boolean
    required?: boolean
    selected?: boolean
  }
  accessibilityValue?: {
    max?: number
    min?: number
    now?: number
    text?: string
  }
  children?: any
  focusable?: boolean
  nativeID?: string
  onBlur?: (e: any) => void
  onClick?: (e: any) => void
  onClickCapture?: (e: any) => void
  onContextMenu?: (e: any) => void
  onFocus?: (e: any) => void
  onKeyDown?: (e: any) => void
  onKeyUp?: (e: any) => void
  onMoveShouldSetResponder?: (e: any) => boolean
  onMoveShouldSetResponderCapture?: (e: any) => boolean
  onResponderEnd?: (e: any) => void
  onResponderGrant?: (e: any) => void
  onResponderMove?: (e: any) => void
  onResponderReject?: (e: any) => void
  onResponderRelease?: (e: any) => void
  onResponderStart?: (e: any) => void
  onResponderTerminate?: (e: any) => void
  onResponderTerminationRequest?: (e: any) => boolean
  onScrollShouldSetResponder?: (e: any) => boolean
  onScrollShouldSetResponderCapture?: (e: any) => boolean
  onSelectionChangeShouldSetResponder?: (e: any) => boolean
  onSelectionChangeShouldSetResponderCapture?: (e: any) => boolean
  onStartShouldSetResponder?: (e: any) => boolean
  onStartShouldSetResponderCapture?: (e: any) => boolean
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
  testID?: string
  // unstable
  dataSet?: Object
  onMouseDown?: (e: any) => void
  onMouseEnter?: (e: any) => void
  onMouseLeave?: (e: any) => void
  onMouseMove?: (e: any) => void
  onMouseOver?: (e: any) => void
  onMouseOut?: (e: any) => void
  onMouseUp?: (e: any) => void
  onScroll?: (e: any) => void
  onTouchCancel?: (e: any) => void
  onTouchCancelCapture?: (e: any) => void
  onTouchEnd?: (e: any) => void
  onTouchEndCapture?: (e: any) => void
  onTouchMove?: (e: any) => void
  onTouchMoveCapture?: (e: any) => void
  onTouchStart?: (e: any) => void
  onTouchStartCapture?: (e: any) => void
  onWheel?: (e: any) => void
  href?: string
  hrefAttrs?: { download?: boolean; rel?: string; target?: string }
}
