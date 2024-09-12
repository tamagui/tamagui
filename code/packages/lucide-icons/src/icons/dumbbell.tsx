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

export const Dumbbell = React.memo<IconProps>(themed(Icon))
