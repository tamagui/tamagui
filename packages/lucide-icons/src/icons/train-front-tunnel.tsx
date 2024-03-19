import React, { memo } from 'react'
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
      <Path d="M2 22V12a10 10 0 1 1 20 0v10" stroke={color} />
      <Path d="M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8" stroke={color} />
      <Path d="M10 15h.01" stroke={color} />
      <Path d="M14 15h.01" stroke={color} />
      <Path d="M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z" stroke={color} />
      <Path d="m9 19-2 3" stroke={color} />
      <Path d="m15 19 2 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TrainFrontTunnel'

export const TrainFrontTunnel = memo<IconProps>(themed(Icon))
