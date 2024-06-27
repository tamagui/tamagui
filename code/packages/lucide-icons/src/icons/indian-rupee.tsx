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
      <Path d="M6 3h12" stroke={color} />
      <Path d="M6 8h12" stroke={color} />
      <Path d="m6 13 8.5 8" stroke={color} />
      <Path d="M6 13h3" stroke={color} />
      <Path d="M9 13c6.667 0 6.667-10 0-10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'IndianRupee'

export const IndianRupee = memo<IconProps>(themed(Icon))
