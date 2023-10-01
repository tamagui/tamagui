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
      <Rect width="6" height="14" x="4" y="5" rx="2" stroke={color} />
      <Rect width="6" height="10" x="14" y="7" rx="2" stroke={color} />
      <Path d="M17 22v-5" stroke={color} />
      <Path d="M17 7V2" stroke={color} />
      <Path d="M7 22v-3" stroke={color} />
      <Path d="M7 5V2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignHorizontalDistributeCenter'

export const AlignHorizontalDistributeCenter = memo<IconProps>(themed(Icon))
