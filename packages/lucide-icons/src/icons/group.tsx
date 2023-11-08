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
      <Path d="M3 7V5c0-1.1.9-2 2-2h2" stroke={color} />
      <Path d="M17 3h2c1.1 0 2 .9 2 2v2" stroke={color} />
      <Path d="M21 17v2c0 1.1-.9 2-2 2h-2" stroke={color} />
      <Path d="M7 21H5c-1.1 0-2-.9-2-2v-2" stroke={color} />
      <Rect width="7" height="5" x="7" y="7" rx="1" stroke={color} />
      <Rect width="7" height="5" x="10" y="12" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Group'

export const Group = memo<IconProps>(themed(Icon))
