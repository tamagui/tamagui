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
      <Rect width="16" height="20" x="4" y="2" rx="2" stroke={color} />
      <Path d="M12 6h.01" stroke={color} />
      <_Circle cx="12" cy="14" r="4" stroke={color} />
      <Path d="M12 14h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Speaker'

export const Speaker = memo<IconProps>(themed(Icon))
