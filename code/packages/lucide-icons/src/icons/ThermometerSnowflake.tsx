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

export const ThermometerSnowflake: IconComponent = themed(
  memo(function ThermometerSnowflake(props: IconProps) {
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
        <Path d="M10.585 15H10" stroke={color} />
        <Path d="M2 12h6.5L10 9" stroke={color} />
        <Path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" stroke={color} />
        <Path d="m4 10 1.5 2L4 14" stroke={color} />
        <Path d="m7 21 3-6-1.5-3" stroke={color} />
        <Path d="m7 3 3 6h2" stroke={color} />
      </Svg>
    )
  })
)
