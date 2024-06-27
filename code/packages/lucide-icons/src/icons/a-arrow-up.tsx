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
      <Path d="M3.5 13h6" stroke={color} />
      <Path d="m2 16 4.5-9 4.5 9" stroke={color} />
      <Path d="M18 16V7" stroke={color} />
      <Path d="m14 11 4-4 4 4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AArrowUp'

export const AArrowUp = memo<IconProps>(themed(Icon))
