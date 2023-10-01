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
      <Path d="m2 9 3-3 3 3" stroke={color} />
      <Path d="M13 18H7a2 2 0 0 1-2-2V6" stroke={color} />
      <Path d="m22 15-3 3-3-3" stroke={color} />
      <Path d="M11 6h6a2 2 0 0 1 2 2v10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Repeat2'

export const Repeat2 = memo<IconProps>(themed(Icon))
