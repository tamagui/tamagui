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
      <Line x1="9" x2="9" y1="4" y2="20" stroke={color} />
      <Path d="M4 7c0-1.7 1.3-3 3-3h13" stroke={color} />
      <Path d="M18 20c-1.7 0-3-1.3-3-3V4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Pi'

export const Pi = React.memo<IconProps>(themed(Icon))
