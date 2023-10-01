import type { IconProps } from '@tamagui/helpers-icon'
import { themed } from '@tamagui/helpers-icon'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Polygon,
  Polyline,
  RadialGradient,
  Rect,
  Stop,
  Svg,
  Symbol,
  Use,
  Circle as _Circle,
  Text as _Text,
} from 'react-native-svg'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <Path d="m12 19 7-7 3 3-7 7-3-3z" stroke={color} />
      <Path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" stroke={color} />
      <Path d="m2 2 7.586 7.586" stroke={color} />
      <_Circle cx="11" cy="11" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PenTool'

export const PenTool = memo<IconProps>(themed(Icon))
