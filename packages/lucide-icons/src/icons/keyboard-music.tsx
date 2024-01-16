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
      <Rect width="20" height="16" x="2" y="4" rx="2" stroke={color} />
      <Path d="M6 8h4" stroke={color} />
      <Path d="M14 8h.01" stroke={color} />
      <Path d="M18 8h.01" stroke={color} />
      <Path d="M2 12h20" stroke={color} />
      <Path d="M6 12v4" stroke={color} />
      <Path d="M10 12v4" stroke={color} />
      <Path d="M14 12v4" stroke={color} />
      <Path d="M18 12v4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'KeyboardMusic'

export const KeyboardMusic = memo<IconProps>(themed(Icon))
