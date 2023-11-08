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
      <Path d="M6.87 6.87a8 8 0 1 0 11.26 11.26" stroke={color} />
      <Path d="M19.9 14.25a8 8 0 0 0-9.15-9.15" stroke={color} />
      <Path d="m22 6-3-3" stroke={color} />
      <Path d="M6.26 18.67 4 21" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M4 4 2 6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlarmClockOff'

export const AlarmClockOff = memo<IconProps>(themed(Icon))
