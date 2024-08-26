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
      <Line x1="21" x2="14" y1="4" y2="4" stroke={color} />
      <Line x1="10" x2="3" y1="4" y2="4" stroke={color} />
      <Line x1="21" x2="12" y1="12" y2="12" stroke={color} />
      <Line x1="8" x2="3" y1="12" y2="12" stroke={color} />
      <Line x1="21" x2="16" y1="20" y2="20" stroke={color} />
      <Line x1="12" x2="3" y1="20" y2="20" stroke={color} />
      <Line x1="14" x2="14" y1="2" y2="6" stroke={color} />
      <Line x1="8" x2="8" y1="10" y2="14" stroke={color} />
      <Line x1="16" x2="16" y1="18" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SlidersHorizontal'

export const SlidersHorizontal = React.memo<IconProps>(themed(Icon))
