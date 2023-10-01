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
      <Ellipse cx="12" cy="5" rx="9" ry="3" stroke={color} />
      <Path d="M3 5V19A9 3 0 0 0 21 19V5" stroke={color} />
      <Path d="M3 12A9 3 0 0 0 21 12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Database'

export const Database = memo<IconProps>(themed(Icon))
