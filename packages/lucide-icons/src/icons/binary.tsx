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
      <Path d="M6 20h4" stroke={color} />
      <Path d="M14 10h4" stroke={color} />
      <Path d="M6 14h2v6" stroke={color} />
      <Path d="M14 4h2v6" stroke={color} />
      <Rect width="4" height="6" x="6" y="4" stroke={color} />
      <Rect width="4" height="6" x="14" y="14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Binary'

export const Binary = memo<IconProps>(themed(Icon))
