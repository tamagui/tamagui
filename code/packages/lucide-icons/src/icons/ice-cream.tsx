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
      <Path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11" stroke={color} />
      <Path d="M17 7A5 5 0 0 0 7 7" stroke={color} />
      <Path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'IceCream'

export const IceCream = React.memo<IconProps>(themed(Icon))
