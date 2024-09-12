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
      <Path d="M3 4h9l1 7" stroke={color} />
      <Path d="M4 11V4" stroke={color} />
      <Path d="M8 10V4" stroke={color} />
      <Path d="M18 5c-.6 0-1 .4-1 1v5.6" stroke={color} />
      <Path d="m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5h-1" stroke={color} />
      <_Circle cx="7" cy="15" r=".5" stroke={color} />
      <_Circle cx="7" cy="15" r="5" stroke={color} />
      <Path d="M16 18h-5" stroke={color} />
      <_Circle cx="18" cy="18" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Tractor'

export const Tractor = React.memo<IconProps>(themed(Icon))
