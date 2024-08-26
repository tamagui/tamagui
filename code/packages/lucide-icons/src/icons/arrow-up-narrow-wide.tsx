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
      <Path d="m3 8 4-4 4 4" stroke={color} />
      <Path d="M7 4v16" stroke={color} />
      <Path d="M11 12h4" stroke={color} />
      <Path d="M11 16h7" stroke={color} />
      <Path d="M11 20h10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpNarrowWide'

export const ArrowUpNarrowWide = React.memo<IconProps>(themed(Icon))
