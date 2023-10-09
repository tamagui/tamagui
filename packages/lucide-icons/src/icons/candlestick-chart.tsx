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
      <Path d="M9 5v4" stroke={color} />
      <Rect width="4" height="6" x="7" y="9" rx="1" stroke={color} />
      <Path d="M9 15v2" stroke={color} />
      <Path d="M17 3v2" stroke={color} />
      <Rect width="4" height="8" x="15" y="5" rx="1" stroke={color} />
      <Path d="M17 13v3" stroke={color} />
      <Path d="M3 3v18h18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CandlestickChart'

export const CandlestickChart = memo<IconProps>(themed(Icon))
