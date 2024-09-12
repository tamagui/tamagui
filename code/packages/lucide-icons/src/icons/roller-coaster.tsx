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
      <Path d="M6 19V5" stroke={color} />
      <Path d="M10 19V6.8" stroke={color} />
      <Path d="M14 19v-7.8" stroke={color} />
      <Path d="M18 5v4" stroke={color} />
      <Path d="M18 19v-6" stroke={color} />
      <Path d="M22 19V9" stroke={color} />
      <Path
        d="M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'RollerCoaster'

export const RollerCoaster = React.memo<IconProps>(themed(Icon))
