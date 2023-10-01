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
