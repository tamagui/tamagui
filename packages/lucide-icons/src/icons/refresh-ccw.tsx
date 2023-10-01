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
      <Path d="M3 2v6h6" stroke={color} />
      <Path d="M21 12A9 9 0 0 0 6 5.3L3 8" stroke={color} />
      <Path d="M21 22v-6h-6" stroke={color} />
      <Path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RefreshCcw'

export const RefreshCcw = memo<IconProps>(themed(Icon))
