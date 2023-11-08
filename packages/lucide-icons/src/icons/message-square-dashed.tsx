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
      <Path d="M3 6V5c0-1.1.9-2 2-2h2" stroke={color} />
      <Path d="M11 3h3" stroke={color} />
      <Path d="M18 3h1c1.1 0 2 .9 2 2" stroke={color} />
      <Path d="M21 9v2" stroke={color} />
      <Path d="M21 15c0 1.1-.9 2-2 2h-1" stroke={color} />
      <Path d="M14 17h-3" stroke={color} />
      <Path d="m7 17-4 4v-5" stroke={color} />
      <Path d="M3 12v-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageSquareDashed'

export const MessageSquareDashed = memo<IconProps>(themed(Icon))
