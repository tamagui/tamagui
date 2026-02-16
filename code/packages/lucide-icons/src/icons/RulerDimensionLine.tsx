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

export const RulerDimensionLine: IconComponent = themed(
  memo(function RulerDimensionLine(props: IconProps) {
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
        <Path d="M12 15v-3.014" stroke={color} />
        <Path d="M16 15v-3.014" stroke={color} />
        <Path d="M20 6H4" stroke={color} />
        <Path d="M20 8V4" stroke={color} />
        <Path d="M4 8V4" stroke={color} />
        <Path d="M8 15v-3.014" stroke={color} />
        <Rect x="3" y="12" width="18" height="7" rx="1" stroke={color} />
      </Svg>
    )
  })
)
