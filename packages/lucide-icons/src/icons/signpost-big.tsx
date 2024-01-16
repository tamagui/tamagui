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
      <Path d="M10 9H4L2 7l2-2h6" stroke={color} />
      <Path d="M14 5h6l2 2-2 2h-6" stroke={color} />
      <Path d="M10 22V4a2 2 0 1 1 4 0v18" stroke={color} />
      <Path d="M8 22h8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SignpostBig'

export const SignpostBig = memo<IconProps>(themed(Icon))
