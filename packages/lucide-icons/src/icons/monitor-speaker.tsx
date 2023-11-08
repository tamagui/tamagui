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
      <Path d="M5.5 20H8" stroke={color} />
      <Path d="M17 9h.01" stroke={color} />
      <Rect width="10" height="16" x="12" y="4" rx="2" stroke={color} />
      <Path d="M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4" stroke={color} />
      <_Circle cx="17" cy="15" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MonitorSpeaker'

export const MonitorSpeaker = memo<IconProps>(themed(Icon))
