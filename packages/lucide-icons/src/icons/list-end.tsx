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
      <Path d="M16 12H3" stroke={color} />
      <Path d="M16 6H3" stroke={color} />
      <Path d="M10 18H3" stroke={color} />
      <Path d="M21 6v10a2 2 0 0 1-2 2h-4" stroke={color} />
      <Path d="m16 16-2 2 2 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListEnd'

export const ListEnd = memo<IconProps>(themed(Icon))
