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

export const BatteryWarning: IconComponent = themed(
  memo(function BatteryWarning(props: IconProps) {
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
        <Path d="M10 17h.01" stroke={color} />
        <Path d="M10 7v6" stroke={color} />
        <Path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" stroke={color} />
        <Path d="M22 11v2" stroke={color} />
        <Path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke={color} />
      </Svg>
    )
  })
)
