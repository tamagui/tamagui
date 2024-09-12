import React from 'react'
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
      <Path d="m9 9 5 12 1.8-5.2L21 14Z" stroke={color} />
      <Path d="M7.2 2.2 8 5.1" stroke={color} />
      <Path d="m5.1 8-2.9-.8" stroke={color} />
      <Path d="M14 4.1 12 6" stroke={color} />
      <Path d="m6 12-1.9 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MousePointerClick'

export const MousePointerClick = React.memo<IconProps>(themed(Icon))
