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
      <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} />
      <Rect x="9" y="9" width="6" height="6" stroke={color} />
      <Path d="M15 2v2" stroke={color} />
      <Path d="M15 20v2" stroke={color} />
      <Path d="M2 15h2" stroke={color} />
      <Path d="M2 9h2" stroke={color} />
      <Path d="M20 15h2" stroke={color} />
      <Path d="M20 9h2" stroke={color} />
      <Path d="M9 2v2" stroke={color} />
      <Path d="M9 20v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cpu'

export const Cpu = React.memo<IconProps>(themed(Icon))
