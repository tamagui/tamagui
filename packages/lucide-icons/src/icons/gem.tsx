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
      <Polygon points="6 3 18 3 22 9 12 22 2 9" stroke={color} />
      <Path d="m12 22 4-13-3-6" stroke={color} />
      <Path d="M12 22 8 9l3-6" stroke={color} />
      <Path d="M2 9h20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Gem'

export const Gem = memo<IconProps>(themed(Icon))
