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
      <_Circle cx="16" cy="4" r="1" stroke={color} />
      <Path d="m18 19 1-7-6 1" stroke={color} />
      <Path d="m5 8 3-3 5.5 3-2.36 3.5" stroke={color} />
      <Path d="M4.24 14.5a5 5 0 0 0 6.88 6" stroke={color} />
      <Path d="M13.76 17.5a5 5 0 0 0-6.88-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Accessibility'

export const Accessibility = memo<IconProps>(themed(Icon))
