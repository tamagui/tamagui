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
      <Path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke={color} />
      <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke={color} />
      <Path d="M4 2C2.8 3.7 2 5.7 2 8" stroke={color} />
      <Path d="M22 8c0-2.3-.8-4.3-2-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BellRing'

export const BellRing = memo<IconProps>(themed(Icon))
