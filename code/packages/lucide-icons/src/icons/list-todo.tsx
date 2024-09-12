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
      <Rect x="3" y="5" width="6" height="6" rx="1" stroke={color} />
      <Path d="m3 17 2 2 4-4" stroke={color} />
      <Path d="M13 6h8" stroke={color} />
      <Path d="M13 12h8" stroke={color} />
      <Path d="M13 18h8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListTodo'

export const ListTodo = React.memo<IconProps>(themed(Icon))
