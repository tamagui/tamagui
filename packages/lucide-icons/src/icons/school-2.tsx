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
      <_Circle cx="12" cy="10" r="1" stroke={color} />
      <Path
        d="M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
        stroke={color}
      />
      <Path d="M6 17v.01" stroke={color} />
      <Path d="M6 13v.01" stroke={color} />
      <Path d="M18 17v.01" stroke={color} />
      <Path d="M18 13v.01" stroke={color} />
      <Path d="M14 22v-5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'School2'

export const School2 = memo<IconProps>(themed(Icon))
