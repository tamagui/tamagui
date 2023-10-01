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
      <Path d="M12 2v20" stroke={color} />
      <Path d="M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4" stroke={color} />
      <Path d="M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4" stroke={color} />
      <Path d="M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1" stroke={color} />
      <Path d="M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignCenterVertical'

export const AlignCenterVertical = memo<IconProps>(themed(Icon))
