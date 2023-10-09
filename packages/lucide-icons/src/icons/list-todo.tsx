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
      <Rect x="3" y="5" width="6" height="6" rx="1" stroke={color} />
      <Path d="m3 17 2 2 4-4" stroke={color} />
      <Path d="M13 6h8" stroke={color} />
      <Path d="M13 12h8" stroke={color} />
      <Path d="M13 18h8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListTodo'

export const ListTodo = memo<IconProps>(themed(Icon))
