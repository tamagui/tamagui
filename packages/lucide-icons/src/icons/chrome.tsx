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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Line x1="21.17" x2="12" y1="8" y2="8" stroke={color} />
      <Line x1="3.95" x2="8.54" y1="6.06" y2="14" stroke={color} />
      <Line x1="10.88" x2="15.46" y1="21.94" y2="14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Chrome'

export const Chrome = memo<IconProps>(themed(Icon))
