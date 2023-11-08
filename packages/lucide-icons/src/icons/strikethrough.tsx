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
      <Path d="M16 4H9a3 3 0 0 0-2.83 4" stroke={color} />
      <Path d="M14 12a4 4 0 0 1 0 8H6" stroke={color} />
      <Line x1="4" x2="20" y1="12" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Strikethrough'

export const Strikethrough = memo<IconProps>(themed(Icon))
