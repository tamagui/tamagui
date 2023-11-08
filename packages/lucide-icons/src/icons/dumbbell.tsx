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
      <Path d="m6.5 6.5 11 11" stroke={color} />
      <Path d="m21 21-1-1" stroke={color} />
      <Path d="m3 3 1 1" stroke={color} />
      <Path d="m18 22 4-4" stroke={color} />
      <Path d="m2 6 4-4" stroke={color} />
      <Path d="m3 10 7-7" stroke={color} />
      <Path d="m14 21 7-7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Dumbbell'

export const Dumbbell = memo<IconProps>(themed(Icon))
