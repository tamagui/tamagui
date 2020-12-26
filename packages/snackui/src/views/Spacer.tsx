import React, { memo } from 'react'
import { View, ViewStyle } from 'react-native'

export type Spacing =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | number
  | boolean
  | string

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

const getSize = ({
  size = 'md',
  direction = 'both',
} = defaultProps): ViewStyle => {
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
      flex: getFlex,
      size: getSize,
    },
  }
}

function spaceToPx(space: Spacing) {
  if (space == 'xxs') return 2
  if (space == 'xs') return 4
  if (space == 'sm') return 8
  if (space === 'md' || space === true) return 12
  if (space == 'lg') return 16
  if (space == 'xl') return 24
  if (space == 'xxl') return 36
  if (space == 'xxxl') return 48
  if (typeof space === 'number') return space
  if (typeof space === 'string') return space
  return 0
}
