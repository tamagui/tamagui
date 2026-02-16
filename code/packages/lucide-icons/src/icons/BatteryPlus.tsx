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

export const BatteryPlus: IconComponent = themed(
  memo(function BatteryPlus(props: IconProps) {
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
        <Path d="M10 9v6" stroke={color} />
        <Path d="M13.5 7H16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2.5" stroke={color} />
        <Path d="M22 11v2" stroke={color} />
        <Path d="M6.5 17H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2.5" stroke={color} />
        <Path d="M7 12h6" stroke={color} />
      </Svg>
    )
  })
)
