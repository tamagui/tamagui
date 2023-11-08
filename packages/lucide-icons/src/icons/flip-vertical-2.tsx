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
      <Path d="m17 3-5 5-5-5h10" stroke={color} />
      <Path d="m17 21-5-5-5 5h10" stroke={color} />
      <Path d="M4 12H2" stroke={color} />
      <Path d="M10 12H8" stroke={color} />
      <Path d="M16 12h-2" stroke={color} />
      <Path d="M22 12h-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FlipVertical2'

export const FlipVertical2 = memo<IconProps>(themed(Icon))
