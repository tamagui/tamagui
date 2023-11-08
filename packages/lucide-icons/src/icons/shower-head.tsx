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
      <Path d="m4 4 2.5 2.5" stroke={color} />
      <Path d="M13.5 6.5a4.95 4.95 0 0 0-7 7" stroke={color} />
      <Path d="M15 5 5 15" stroke={color} />
      <Path d="M14 17v.01" stroke={color} />
      <Path d="M10 16v.01" stroke={color} />
      <Path d="M13 13v.01" stroke={color} />
      <Path d="M16 10v.01" stroke={color} />
      <Path d="M11 20v.01" stroke={color} />
      <Path d="M17 14v.01" stroke={color} />
      <Path d="M20 11v.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ShowerHead'

export const ShowerHead = memo<IconProps>(themed(Icon))
