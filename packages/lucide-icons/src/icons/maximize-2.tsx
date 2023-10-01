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
      <Polyline points="15 3 21 3 21 9" stroke={color} />
      <Polyline points="9 21 3 21 3 15" stroke={color} />
      <Line x1="21" x2="14" y1="3" y2="10" stroke={color} />
      <Line x1="3" x2="10" y1="21" y2="14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Maximize2'

export const Maximize2 = memo<IconProps>(themed(Icon))
