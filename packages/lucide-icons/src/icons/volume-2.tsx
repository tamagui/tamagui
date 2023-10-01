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
      <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" stroke={color} />
      <Path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={color} />
      <Path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Volume2'

export const Volume2 = memo<IconProps>(themed(Icon))
