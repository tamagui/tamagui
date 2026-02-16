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

export const ImageUpscale: IconComponent = themed(
  memo(function ImageUpscale(props: IconProps) {
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
        <Path d="M16 3h5v5" stroke={color} />
        <Path d="M17 21h2a2 2 0 0 0 2-2" stroke={color} />
        <Path d="M21 12v3" stroke={color} />
        <Path d="m21 3-5 5" stroke={color} />
        <Path d="M3 7V5a2 2 0 0 1 2-2" stroke={color} />
        <Path d="m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19" stroke={color} />
        <Path d="M9 3h3" stroke={color} />
        <Rect x="3" y="11" width="10" height="10" rx="1" stroke={color} />
      </Svg>
    )
  })
)
