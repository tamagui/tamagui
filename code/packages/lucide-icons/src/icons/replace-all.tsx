import React from 'react'
import PropTypes from 'prop-types'
import type { IconProps } from '@tamagui/helpers-icon'
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

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
      <Path d="M14 4c0-1.1.9-2 2-2" stroke={color} />
      <Path d="M20 2c1.1 0 2 .9 2 2" stroke={color} />
      <Path d="M22 8c0 1.1-.9 2-2 2" stroke={color} />
      <Path d="M16 10c-1.1 0-2-.9-2-2" stroke={color} />
      <Path d="m3 7 3 3 3-3" stroke={color} />
      <Path d="M6 10V5c0-1.7 1.3-3 3-3h1" stroke={color} />
      <Rect width="8" height="8" x="2" y="14" rx="2" stroke={color} />
      <Path d="M14 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" stroke={color} />
      <Path d="M20 14c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ReplaceAll'

export const ReplaceAll = React.memo<IconProps>(themed(Icon))
