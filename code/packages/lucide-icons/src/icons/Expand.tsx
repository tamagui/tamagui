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

export const Expand: IconComponent = themed(
  memo(function Expand(props: IconProps) {
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
        <Path d="m15 15 6 6" stroke={color} />
        <Path d="m15 9 6-6" stroke={color} />
        <Path d="M21 16v5h-5" stroke={color} />
        <Path d="M21 8V3h-5" stroke={color} />
        <Path d="M3 16v5h5" stroke={color} />
        <Path d="m3 21 6-6" stroke={color} />
        <Path d="M3 8V3h5" stroke={color} />
        <Path d="M9 9 3 3" stroke={color} />
      </Svg>
    )
  })
)
