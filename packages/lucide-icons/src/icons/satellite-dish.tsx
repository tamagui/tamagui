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
      <Path d="M4 10a7.31 7.31 0 0 0 10 10Z" stroke={color} />
      <Path d="m9 15 3-3" stroke={color} />
      <Path d="M17 13a6 6 0 0 0-6-6" stroke={color} />
      <Path d="M21 13A10 10 0 0 0 11 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SatelliteDish'

export const SatelliteDish = memo<IconProps>(themed(Icon))
