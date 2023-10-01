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
      <Path d="M2,16V4c0-1.1,0.9-2,2-2h11" stroke={color} />
      <Path d="M5,14H4c-1.1,0-2,0.9-2,2s0.9,2,2,2h1" stroke={color} />
      <Path d="M22,18H11c-1.1,0-2,0.9-2,2l0,0" stroke={color} />
      <Path
        d="M11,6h11v16H11c-1.1,0-2-0.9-2-2V8C9,6.9,9.9,6,11,6z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'BookCopy'

export const BookCopy = memo<IconProps>(themed(Icon))
