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
      <Rect width="20" height="14" x="2" y="3" rx="2" ry="2" stroke={color} />
      <Line x1="8" x2="16" y1="21" y2="21" stroke={color} />
      <Line x1="12" x2="12" y1="17" y2="21" stroke={color} />
      <Path d="M12 13V7" stroke={color} />
      <Path d="m15 10-3 3-3-3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MonitorDown'

export const MonitorDown = memo<IconProps>(themed(Icon))
