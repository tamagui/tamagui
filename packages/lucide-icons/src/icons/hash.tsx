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
      <Line x1="4" x2="20" y1="9" y2="9" stroke={color} />
      <Line x1="4" x2="20" y1="15" y2="15" stroke={color} />
      <Line x1="10" x2="8" y1="3" y2="21" stroke={color} />
      <Line x1="16" x2="14" y1="3" y2="21" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Hash'

export const Hash = memo<IconProps>(themed(Icon))
