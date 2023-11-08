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
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Path d="M12 4h.01" stroke={color} />
      <Path d="M20 12h.01" stroke={color} />
      <Path d="M12 20h.01" stroke={color} />
      <Path d="M4 12h.01" stroke={color} />
      <Path d="M17.657 6.343h.01" stroke={color} />
      <Path d="M17.657 17.657h.01" stroke={color} />
      <Path d="M6.343 17.657h.01" stroke={color} />
      <Path d="M6.343 6.343h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SunDim'

export const SunDim = memo<IconProps>(themed(Icon))
