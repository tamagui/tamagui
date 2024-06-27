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
      <_Circle cx="12" cy="5" r="2" stroke={color} />
      <Path d="m3 21 8.02-14.26" stroke={color} />
      <Path d="m12.99 6.74 1.93 3.44" stroke={color} />
      <Path d="M19 12c-3.87 4-10.13 4-14 0" stroke={color} />
      <Path d="m21 21-2.16-3.84" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'DraftingCompass'

export const DraftingCompass = memo<IconProps>(themed(Icon))
