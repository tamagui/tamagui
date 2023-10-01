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
      <Path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" stroke={color} />
      <Path d="M21 14 10 2 3 14h18Z" stroke={color} />
      <Path d="M10 2v16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Sailboat'

export const Sailboat = memo<IconProps>(themed(Icon))
