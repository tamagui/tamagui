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

export const ChartColumnStacked: IconComponent = themed(
  memo(function ChartColumnStacked(props: IconProps) {
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
        <Path d="M11 13H7" stroke={color} />
        <Path d="M19 9h-4" stroke={color} />
        <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
        <Rect x="15" y="5" width="4" height="12" rx="1" stroke={color} />
        <Rect x="7" y="8" width="4" height="9" rx="1" stroke={color} />
      </Svg>
    )
  })
)
