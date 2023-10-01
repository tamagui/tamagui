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
      <Line x1="8" x2="16" y1="12" y2="12" stroke={color} />
      <Line x1="12" x2="12" y1="16" y2="16" stroke={color} />
      <Line x1="12" x2="12" y1="8" y2="8" stroke={color} />
      <_Circle cx="12" cy="12" r="10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'DivideCircle'

export const DivideCircle = memo<IconProps>(themed(Icon))
