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
      <Rect width="6" height="6" x="9" y="2" stroke={color} />
      <Rect width="6" height="6" x="16" y="16" stroke={color} />
      <Rect width="6" height="6" x="2" y="16" stroke={color} />
      <Path d="M5 16v-4h14v4" stroke={color} />
      <Path d="M12 12V8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Network'

export const Network = memo<IconProps>(themed(Icon))
