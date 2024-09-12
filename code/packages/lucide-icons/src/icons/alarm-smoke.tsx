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
      <Path d="M4 8a2 2 0 0 1-2-2V3h20v3a2 2 0 0 1-2 2Z" stroke={color} />
      <Path d="m19 8-.8 3c-.1.6-.6 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L5 8" stroke={color} />
      <Path d="M16 21c0-2.5 2-2.5 2-5" stroke={color} />
      <Path d="M11 21c0-2.5 2-2.5 2-5" stroke={color} />
      <Path d="M6 21c0-2.5 2-2.5 2-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlarmSmoke'

export const AlarmSmoke = React.memo<IconProps>(themed(Icon))
