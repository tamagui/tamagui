import React, { memo } from 'react'
import { View, ViewStyle } from 'react-native'

import { Size } from './Size'

export type Spacing = Size | boolean | string

export type SpacerProps = {
  size?: Spacing
  flex?: boolean | number
  direction?: 'vertical' | 'horizontal' | 'both'
}

const defaultProps: SpacerProps = {
  size: 'md',
  direction: 'both',
}

export const Spacer = memo((props: SpacerProps) => {
  return <View style={getStyle(props)} />
})

const getStyle = (props: SpacerProps = defaultProps): ViewStyle => {
  return {
    flexShrink: 0,
    ...getFlex(props),
    ...getSize(props),
  }
}

const getFlex = ({ flex }: SpacerProps = defaultProps): ViewStyle => {
  return {
    flex: flex === true ? 1 : flex === false ? 0 : flex ?? 0,
  }
}

const getSize = ({ size = 'md', direction = 'both' } = defaultProps): ViewStyle => {
  const sizePx = spaceToPx(size)
  const width = direction == 'vertical' ? 1 : sizePx
  const height = direction == 'horizontal' ? 1 : sizePx
  return {
    minWidth: width,
    minHeight: height,
  }
}

if (process.env.IS_STATIC) {
  Spacer['staticConfig'] = {
    validStyles: require('@snackui/helpers').stylePropsView,
    defaultProps: getStyle(),
    expansionProps: {
      direction: () => null,
      flex: getFlex,
      size: getSize,
    },
  }
}

function spaceToPx(space: Spacing) {
  switch (space) {
    case 'xxxxxs':
      return 0.25
    case 'xxxxs':
      return 0.5
    case 'xxxs':
      return 1
    case 'xxs':
      return 2
    case 'xs':
      return 4
    case 'sm':
      return 8
    case true:
    case 'md':
      return 12
    case 'lg':
      return 16
    case 'xl':
      return 24
    case 'xxl':
      return 36
    case 'xxxl':
      return 48
    case 'xxxxl':
      return 96
    case 'xxxxxl':
      return 192
    default:
      if (typeof space === 'number') return space
      if (typeof space === 'string') return space
  }
  return 0
}
