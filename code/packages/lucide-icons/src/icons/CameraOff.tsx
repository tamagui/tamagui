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

export const CameraOff: IconComponent = themed(
  memo(function CameraOff(props: IconProps) {
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
        <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
        <Path d="M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16" stroke={color} />
        <Path d="M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5" stroke={color} />
        <Path d="M14.121 15.121A3 3 0 1 1 9.88 10.88" stroke={color} />
      </Svg>
    )
  })
)
