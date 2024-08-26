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
      <Path d="M22 11v1a10 10 0 1 1-9-10" stroke={color} />
      <Path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={color} />
      <Line x1="9" x2="9.01" y1="9" y2="9" stroke={color} />
      <Line x1="15" x2="15.01" y1="9" y2="9" stroke={color} />
      <Path d="M16 5h6" stroke={color} />
      <Path d="M19 2v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SmilePlus'

export const SmilePlus = React.memo<IconProps>(themed(Icon))
