import React, { memo } from 'react'
import PropTypes from 'prop-types'
import type { IconProps } from '@tamagui/helpers-icon'
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

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
      <Path
        d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"
        stroke={color}
      />
      <Path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" stroke={color} />
      <_Circle cx="7" cy="18" r="2" stroke={color} />
      <Path d="M15 18H9" stroke={color} />
      <_Circle cx="17" cy="18" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Truck'

export const Truck = memo<IconProps>(themed(Icon))
