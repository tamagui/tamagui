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

export const Cpu = memo<IconProps>(themed(Icon))
