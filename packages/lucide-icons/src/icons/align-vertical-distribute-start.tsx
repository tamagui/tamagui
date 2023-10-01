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
      <Rect width="14" height="6" x="5" y="14" rx="2" stroke={color} />
      <Rect width="10" height="6" x="7" y="4" rx="2" stroke={color} />
      <Path d="M2 14h20" stroke={color} />
      <Path d="M2 4h20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignVerticalDistributeStart'

export const AlignVerticalDistributeStart = memo<IconProps>(themed(Icon))
