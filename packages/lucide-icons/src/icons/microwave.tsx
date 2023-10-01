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
      <Rect width="20" height="15" x="2" y="4" rx="2" stroke={color} />
      <Rect width="8" height="7" x="6" y="8" rx="1" stroke={color} />
      <Path d="M18 8v7" stroke={color} />
      <Path d="M6 19v2" stroke={color} />
      <Path d="M18 19v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Microwave'

export const Microwave = memo<IconProps>(themed(Icon))
