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
      <Rect width="8" height="14" x="8" y="6" rx="4" stroke={color} />
      <Path d="m19 7-3 2" stroke={color} />
      <Path d="m5 7 3 2" stroke={color} />
      <Path d="m19 19-3-2" stroke={color} />
      <Path d="m5 19 3-2" stroke={color} />
      <Path d="M20 13h-4" stroke={color} />
      <Path d="M4 13h4" stroke={color} />
      <Path d="m10 4 1 2" stroke={color} />
      <Path d="m14 4-1 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bug'

export const Bug = memo<IconProps>(themed(Icon))
