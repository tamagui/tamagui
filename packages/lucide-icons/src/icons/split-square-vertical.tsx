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
      <Path d="M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" stroke={color} />
      <Path d="M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" stroke={color} />
      <Line x1="4" x2="20" y1="12" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SplitSquareVertical'

export const SplitSquareVertical = memo<IconProps>(themed(Icon))
