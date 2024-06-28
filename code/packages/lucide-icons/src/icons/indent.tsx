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
      <Polyline points="3 8 7 12 3 16" stroke={color} />
      <Line x1="21" x2="11" y1="12" y2="12" stroke={color} />
      <Line x1="21" x2="11" y1="6" y2="6" stroke={color} />
      <Line x1="21" x2="11" y1="18" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Indent'

export const Indent = memo<IconProps>(themed(Icon))