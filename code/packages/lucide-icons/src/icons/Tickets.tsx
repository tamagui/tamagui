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

export const Tickets: IconComponent = themed(
  memo(function Tickets(props: IconProps) {
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
        <Path d="m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" stroke={color} />
        <Path d="M6 10V8" stroke={color} />
        <Path d="M6 14v1" stroke={color} />
        <Path d="M6 19v2" stroke={color} />
        <Rect x="2" y="8" width="20" height="13" rx="2" stroke={color} />
      </Svg>
    )
  })
)
