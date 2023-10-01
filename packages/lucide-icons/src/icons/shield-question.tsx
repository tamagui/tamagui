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
      <Path d="M12 17h.01" stroke={color} />
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" stroke={color} />
      <Path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ShieldQuestion'

export const ShieldQuestion = memo<IconProps>(themed(Icon))
