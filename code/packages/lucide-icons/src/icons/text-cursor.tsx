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
      <Path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1" stroke={color} />
      <Path d="M7 22h1a4 4 0 0 0 4-4v-1" stroke={color} />
      <Path d="M7 2h1a4 4 0 0 1 4 4v1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TextCursor'

export const TextCursor = React.memo<IconProps>(themed(Icon))
