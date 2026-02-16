// @ts-nocheck
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import type { NamedExoticComponent } from 'react'
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

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Snowflake: IconComponent = themed(
  memo(function Snowflake(props: IconProps) {
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
        <Path d="m10 20-1.25-2.5L6 18" stroke={color} />
        <Path d="M10 4 8.75 6.5 6 6" stroke={color} />
        <Path d="m14 20 1.25-2.5L18 18" stroke={color} />
        <Path d="m14 4 1.25 2.5L18 6" stroke={color} />
        <Path d="m17 21-3-6h-4" stroke={color} />
        <Path d="m17 3-3 6 1.5 3" stroke={color} />
        <Path d="M2 12h6.5L10 9" stroke={color} />
        <Path d="m20 10-1.5 2 1.5 2" stroke={color} />
        <Path d="M22 12h-6.5L14 15" stroke={color} />
        <Path d="m4 10 1.5 2L4 14" stroke={color} />
        <Path d="m7 21 3-6-1.5-3" stroke={color} />
        <Path d="m7 3 3 6h4" stroke={color} />
      </Svg>
    )
  })
)
