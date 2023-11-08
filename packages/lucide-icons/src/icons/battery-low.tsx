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
      <Rect width="16" height="10" x="2" y="7" rx="2" ry="2" stroke={color} />
      <Line x1="22" x2="22" y1="11" y2="13" stroke={color} />
      <Line x1="6" x2="6" y1="11" y2="13" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BatteryLow'

export const BatteryLow = memo<IconProps>(themed(Icon))
