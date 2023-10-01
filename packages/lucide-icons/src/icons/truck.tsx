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
      <Path d="M10 17h4V5H2v12h3" stroke={color} />
      <Path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" stroke={color} />
      <Path d="M14 17h1" stroke={color} />
      <_Circle cx="7.5" cy="17.5" r="2.5" stroke={color} />
      <_Circle cx="17.5" cy="17.5" r="2.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Truck'

export const Truck = memo<IconProps>(themed(Icon))
