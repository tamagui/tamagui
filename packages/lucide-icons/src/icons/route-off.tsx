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
      <_Circle cx="6" cy="19" r="3" stroke={color} />
      <Path d="M9 19h8.5c.4 0 .9-.1 1.3-.2" stroke={color} />
      <Path d="M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M21 15.3a3.5 3.5 0 0 0-3.3-3.3" stroke={color} />
      <Path d="M15 5h-4.3" stroke={color} />
      <_Circle cx="18" cy="5" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RouteOff'

export const RouteOff = memo<IconProps>(themed(Icon))
