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
      <Path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11" stroke={color} />
      <Path d="M17 7A5 5 0 0 0 7 7" stroke={color} />
      <Path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'IceCream'

export const IceCream = memo<IconProps>(themed(Icon))
