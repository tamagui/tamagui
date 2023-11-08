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
      <Path d="M12 8V4H8" stroke={color} />
      <Rect width="16" height="12" x="4" y="8" rx="2" stroke={color} />
      <Path d="M2 14h2" stroke={color} />
      <Path d="M20 14h2" stroke={color} />
      <Path d="M15 13v2" stroke={color} />
      <Path d="M9 13v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bot'

export const Bot = memo<IconProps>(themed(Icon))
