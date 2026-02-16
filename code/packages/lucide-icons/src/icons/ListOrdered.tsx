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

export const ListOrdered: IconComponent = themed(
  memo(function ListOrdered(props: IconProps) {
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
        <Path d="M10 12h11" stroke={color} />
        <Path d="M10 18h11" stroke={color} />
        <Path d="M10 6h11" stroke={color} />
        <Path d="M4 10h2" stroke={color} />
        <Path d="M4 6h1v4" stroke={color} />
        <Path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke={color} />
      </Svg>
    )
  })
)
