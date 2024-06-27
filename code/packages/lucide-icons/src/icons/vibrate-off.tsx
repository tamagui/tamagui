import React, { memo } from 'react'
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
      <Path d="m2 8 2 2-2 2 2 2-2 2" stroke={color} />
      <Path d="m22 8-2 2 2 2-2 2 2 2" stroke={color} />
      <Path d="M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2" stroke={color} />
      <Path d="M16 10.34V6c0-.55-.45-1-1-1h-4.34" stroke={color} />
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'VibrateOff'

export const VibrateOff = memo<IconProps>(themed(Icon))
