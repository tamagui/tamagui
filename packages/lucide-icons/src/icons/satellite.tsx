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
      <Path d="M13 7 9 3 5 7l4 4" stroke={color} />
      <Path d="m17 11 4 4-4 4-4-4" stroke={color} />
      <Path d="m8 12 4 4 6-6-4-4Z" stroke={color} />
      <Path d="m16 8 3-3" stroke={color} />
      <Path d="M9 21a6 6 0 0 0-6-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Satellite'

export const Satellite = memo<IconProps>(themed(Icon))
