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
      <_Circle cx="6" cy="6" r="3" stroke={color} />
      <_Circle cx="6" cy="18" r="3" stroke={color} />
      <Line x1="20" x2="8.12" y1="4" y2="15.88" stroke={color} />
      <Line x1="14.47" x2="20" y1="14.48" y2="20" stroke={color} />
      <Line x1="8.12" x2="12" y1="8.12" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Scissors'

export const Scissors = memo<IconProps>(themed(Icon))
