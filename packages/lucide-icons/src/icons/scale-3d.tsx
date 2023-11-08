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
      <_Circle cx="19" cy="19" r="2" stroke={color} />
      <_Circle cx="5" cy="5" r="2" stroke={color} />
      <Path d="M5 7v12h12" stroke={color} />
      <Path d="m5 19 6-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Scale3d'

export const Scale3d = memo<IconProps>(themed(Icon))
