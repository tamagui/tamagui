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
      <Rect width="7" height="9" x="3" y="3" rx="1" stroke={color} />
      <Rect width="7" height="5" x="14" y="3" rx="1" stroke={color} />
      <Rect width="7" height="9" x="14" y="12" rx="1" stroke={color} />
      <Rect width="7" height="5" x="3" y="16" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LayoutDashboard'

export const LayoutDashboard = memo<IconProps>(themed(Icon))
