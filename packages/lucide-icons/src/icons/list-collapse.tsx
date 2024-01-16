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
      <Path d="m3 10 2.5-2.5L3 5" stroke={color} />
      <Path d="m3 19 2.5-2.5L3 14" stroke={color} />
      <Path d="M10 6h11" stroke={color} />
      <Path d="M10 12h11" stroke={color} />
      <Path d="M10 18h11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListCollapse'

export const ListCollapse = memo<IconProps>(themed(Icon))
