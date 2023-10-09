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
      <Path
        d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"
        stroke={color}
      />
      <Path d="M7 14h.01" stroke={color} />
      <Path d="M17 14h.01" stroke={color} />
      <Rect width="18" height="8" x="3" y="10" rx="2" stroke={color} />
      <Path d="M5 18v2" stroke={color} />
      <Path d="M19 18v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CarFront'

export const CarFront = memo<IconProps>(themed(Icon))
