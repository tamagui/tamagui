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
      <Path d="m9 9 5 12 1.8-5.2L21 14Z" stroke={color} />
      <Path d="M7.2 2.2 8 5.1" stroke={color} />
      <Path d="m5.1 8-2.9-.8" stroke={color} />
      <Path d="M14 4.1 12 6" stroke={color} />
      <Path d="m6 12-1.9 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MousePointerClick'

export const MousePointerClick = memo<IconProps>(themed(Icon))
