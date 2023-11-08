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
      <_Circle cx="6" cy="15" r="4" stroke={color} />
      <_Circle cx="18" cy="15" r="4" stroke={color} />
      <Path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" stroke={color} />
      <Path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" stroke={color} />
      <Path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Glasses'

export const Glasses = memo<IconProps>(themed(Icon))
