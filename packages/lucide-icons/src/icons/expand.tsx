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
      <Path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" stroke={color} />
      <Path d="M3 16.2V21m0 0h4.8M3 21l6-6" stroke={color} />
      <Path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" stroke={color} />
      <Path d="M3 7.8V3m0 0h4.8M3 3l6 6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Expand'

export const Expand = memo<IconProps>(themed(Icon))
