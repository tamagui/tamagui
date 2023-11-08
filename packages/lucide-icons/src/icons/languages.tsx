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
      <Path d="m5 8 6 6" stroke={color} />
      <Path d="m4 14 6-6 2-3" stroke={color} />
      <Path d="M2 5h12" stroke={color} />
      <Path d="M7 2h1" stroke={color} />
      <Path d="m22 22-5-10-5 10" stroke={color} />
      <Path d="M14 18h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Languages'

export const Languages = memo<IconProps>(themed(Icon))
