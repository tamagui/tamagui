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
      <Path d="M16 4H9a3 3 0 0 0-2.83 4" stroke={color} />
      <Path d="M14 12a4 4 0 0 1 0 8H6" stroke={color} />
      <Line x1="4" x2="20" y1="12" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Strikethrough'

export const Strikethrough = React.memo<IconProps>(themed(Icon))
