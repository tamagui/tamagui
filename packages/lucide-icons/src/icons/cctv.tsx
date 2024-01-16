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
      <Path d="M7 9h.01" stroke={color} />
      <Path d="M16.75 12H22l-3.5 7-3.09-4.32" stroke={color} />
      <Path
        d="M18 9.5l-4 8-10.39-5.2a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3Z"
        stroke={color}
      />
      <Path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" stroke={color} />
      <Path d="M2 21v-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cctv'

export const Cctv = memo<IconProps>(themed(Icon))
