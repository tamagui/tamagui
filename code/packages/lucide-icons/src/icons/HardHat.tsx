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

export const HardHat: IconComponent = themed(
  memo(function HardHat(props: IconProps) {
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
        <Path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" stroke={color} />
        <Path d="M14 6a6 6 0 0 1 6 6v3" stroke={color} />
        <Path d="M4 15v-3a6 6 0 0 1 6-6" stroke={color} />
        <Rect x="2" y="15" width="20" height="4" rx="1" stroke={color} />
      </Svg>
    )
  })
)
