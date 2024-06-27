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
      <Rect width="7" height="12" x="2" y="6" rx="1" stroke={color} />
      <Path d="M13 8.32a7.43 7.43 0 0 1 0 7.36" stroke={color} />
      <Path d="M16.46 6.21a11.76 11.76 0 0 1 0 11.58" stroke={color} />
      <Path d="M19.91 4.1a15.91 15.91 0 0 1 .01 15.8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SmartphoneNfc'

export const SmartphoneNfc = memo<IconProps>(themed(Icon))
