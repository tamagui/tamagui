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

export const ChartNetwork: IconComponent = themed(
  memo(function ChartNetwork(props: IconProps) {
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
        <Path d="m13.11 7.664 1.78 2.672" stroke={color} />
        <Path d="m14.162 12.788-3.324 1.424" stroke={color} />
        <Path d="m20 4-6.06 1.515" stroke={color} />
        <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
        <_Circle cx="12" cy="6" r="2" stroke={color} />
        <_Circle cx="16" cy="12" r="2" stroke={color} />
        <_Circle cx="9" cy="15" r="2" stroke={color} />
      </Svg>
    )
  })
)
