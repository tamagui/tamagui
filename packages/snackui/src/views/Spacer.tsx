import { stylePropsView } from '@snackui/helpers'
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
  return <View style={getSpacerStyle(props)} />
})

export const getSpacerStyle = (props: SpacerProps): ViewStyle => {
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
  // @ts-ignore
  Spacer.staticConfig = {
    validStyles: stylePropsView,
    validPropsExtra: { size: true, direction: true },
    defaultProps,
    postProcessStyles: getSpacerStyle,
  }
}

export const spacingValues = {
  $0: 0,
  $1: 5,
  $2: 10,
  $3: 15,
  $4: 20,
  $5: 25,
  $6: 35,
  $7: 45,
  $8: 60,
  $9: 80,
  $10: 100,
}

export const spacingValuesWithLegacy = {
  ...spacingValues,
  xxxxxs: 0.25,
  xxxxs: 0.5,
  xxxs: 1,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 36,
  xxxl: 48,
  xxxxl: 96,
  xxxxxl: 192,
}

function spaceToPx(space: Spacing) {
  return space === false
    ? 0
    : space === true
    ? spacingValuesWithLegacy.md
    : spacingValuesWithLegacy[space]
}
