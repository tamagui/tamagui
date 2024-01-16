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
      <_Circle cx="12" cy="4.5" r="2.5" stroke={color} />
      <Path d="m10.2 6.3-3.9 3.9" stroke={color} />
      <_Circle cx="4.5" cy="12" r="2.5" stroke={color} />
      <Path d="M7 12h10" stroke={color} />
      <_Circle cx="19.5" cy="12" r="2.5" stroke={color} />
      <Path d="m13.8 17.7 3.9-3.9" stroke={color} />
      <_Circle cx="12" cy="19.5" r="2.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Waypoints'

export const Waypoints = memo<IconProps>(themed(Icon))
