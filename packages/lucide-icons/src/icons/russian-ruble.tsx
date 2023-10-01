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
      <Path d="M14 11c5.333 0 5.333-8 0-8" stroke={color} />
      <Path d="M6 11h8" stroke={color} />
      <Path d="M6 15h8" stroke={color} />
      <Path d="M9 21V3" stroke={color} />
      <Path d="M9 3h5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RussianRuble'

export const RussianRuble = memo<IconProps>(themed(Icon))
