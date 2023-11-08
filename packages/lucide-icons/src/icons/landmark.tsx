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
      <Line x1="3" x2="21" y1="22" y2="22" stroke={color} />
      <Line x1="6" x2="6" y1="18" y2="11" stroke={color} />
      <Line x1="10" x2="10" y1="18" y2="11" stroke={color} />
      <Line x1="14" x2="14" y1="18" y2="11" stroke={color} />
      <Line x1="18" x2="18" y1="18" y2="11" stroke={color} />
      <Polygon points="12 2 20 7 4 7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Landmark'

export const Landmark = memo<IconProps>(themed(Icon))
