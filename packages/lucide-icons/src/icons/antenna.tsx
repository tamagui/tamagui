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
      <Path d="M2 12 7 2" stroke={color} />
      <Path d="m7 12 5-10" stroke={color} />
      <Path d="m12 12 5-10" stroke={color} />
      <Path d="m17 12 5-10" stroke={color} />
      <Path d="M4.5 7h15" stroke={color} />
      <Path d="M12 16v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Antenna'

export const Antenna = memo<IconProps>(themed(Icon))
