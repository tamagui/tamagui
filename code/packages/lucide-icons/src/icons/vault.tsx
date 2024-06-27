import React, { memo } from 'react'
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
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      <_Circle cx="7.5" cy="7.5" r=".5" stroke={color} />
      <Path d="m7.9 7.9 2.7 2.7" stroke={color} />
      <_Circle cx="16.5" cy="7.5" r=".5" stroke={color} />
      <Path d="m13.4 10.6 2.7-2.7" stroke={color} />
      <_Circle cx="7.5" cy="16.5" r=".5" stroke={color} />
      <Path d="m7.9 16.1 2.7-2.7" stroke={color} />
      <_Circle cx="16.5" cy="16.5" r=".5" stroke={color} />
      <Path d="m13.4 13.4 2.7 2.7" stroke={color} />
      <_Circle cx="12" cy="12" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Vault'

export const Vault = memo<IconProps>(themed(Icon))
