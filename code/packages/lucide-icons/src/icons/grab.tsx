import React, { memo } from 'react'
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
      <Path d="M18 11.5V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.4" stroke={color} />
      <Path d="M14 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" stroke={color} />
      <Path d="M10 9.9V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" stroke={color} />
      <Path d="M6 14v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" stroke={color} />
      <Path
        d="M18 11v0a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Grab'

export const Grab = memo<IconProps>(themed(Icon))
