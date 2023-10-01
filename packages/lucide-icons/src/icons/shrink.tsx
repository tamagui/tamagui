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
      <Path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8" stroke={color} />
      <Path d="M9 19.8V15m0 0H4.2M9 15l-6 6" stroke={color} />
      <Path d="M15 4.2V9m0 0h4.8M15 9l6-6" stroke={color} />
      <Path d="M9 4.2V9m0 0H4.2M9 9 3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Shrink'

export const Shrink = memo<IconProps>(themed(Icon))
