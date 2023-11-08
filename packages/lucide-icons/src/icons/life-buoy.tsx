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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Path d="m4.93 4.93 4.24 4.24" stroke={color} />
      <Path d="m14.83 9.17 4.24-4.24" stroke={color} />
      <Path d="m14.83 14.83 4.24 4.24" stroke={color} />
      <Path d="m9.17 14.83-4.24 4.24" stroke={color} />
      <_Circle cx="12" cy="12" r="4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LifeBuoy'

export const LifeBuoy = memo<IconProps>(themed(Icon))
