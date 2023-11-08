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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Line x1="22" x2="18" y1="12" y2="12" stroke={color} />
      <Line x1="6" x2="2" y1="12" y2="12" stroke={color} />
      <Line x1="12" x2="12" y1="6" y2="2" stroke={color} />
      <Line x1="12" x2="12" y1="22" y2="18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Crosshair'

export const Crosshair = memo<IconProps>(themed(Icon))
