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
      <Path d="M18.8 4A6.3 8.7 0 0 1 20 9" stroke={color} />
      <Path d="M9 9h.01" stroke={color} />
      <_Circle cx="9" cy="9" r="7" stroke={color} />
      <Rect width="10" height="6" x="4" y="16" rx="2" stroke={color} />
      <Path d="M14 19c3 0 4.6-1.6 4.6-1.6" stroke={color} />
      <_Circle cx="20" cy="16" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BellElectric'

export const BellElectric = memo<IconProps>(themed(Icon))
