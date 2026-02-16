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

export const ArrowUpZA: IconComponent = themed(
  memo(function ArrowUpZA(props: IconProps) {
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
        <Path d="m3 8 4-4 4 4" stroke={color} />
        <Path d="M7 4v16" stroke={color} />
        <Path d="M15 4h5l-5 6h5" stroke={color} />
        <Path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" stroke={color} />
        <Path d="M20 18h-5" stroke={color} />
      </Svg>
    )
  })
)
