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
      <Path d="M11 8c2-3-2-3 0-6" stroke={color} />
      <Path d="M15.5 8c2-3-2-3 0-6" stroke={color} />
      <Path d="M6 10h.01" stroke={color} />
      <Path d="M6 14h.01" stroke={color} />
      <Path d="M10 16v-4" stroke={color} />
      <Path d="M14 16v-4" stroke={color} />
      <Path d="M18 16v-4" stroke={color} />
      <Path
        d="M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"
        stroke={color}
      />
      <Path d="M5 20v2" stroke={color} />
      <Path d="M19 20v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Heater'

export const Heater = memo<IconProps>(themed(Icon))
