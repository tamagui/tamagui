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
      <Path d="M21 12h-8" stroke={color} />
      <Path d="M21 6H8" stroke={color} />
      <Path d="M21 18h-8" stroke={color} />
      <Path d="M3 6v4c0 1.1.9 2 2 2h3" stroke={color} />
      <Path d="M3 10v6c0 1.1.9 2 2 2h3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListTree'

export const ListTree = memo<IconProps>(themed(Icon))
