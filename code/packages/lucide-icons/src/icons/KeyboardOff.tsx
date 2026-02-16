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

export const KeyboardOff: IconComponent = themed(
  memo(function KeyboardOff(props: IconProps) {
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
        <Path d="M 20 4 A2 2 0 0 1 22 6" stroke={color} />
        <Path d="M 22 6 L 22 16.41" stroke={color} />
        <Path d="M 7 16 L 16 16" stroke={color} />
        <Path d="M 9.69 4 L 20 4" stroke={color} />
        <Path d="M14 8h.01" stroke={color} />
        <Path d="M18 8h.01" stroke={color} />
        <Path d="m2 2 20 20" stroke={color} />
        <Path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" stroke={color} />
        <Path d="M6 8h.01" stroke={color} />
        <Path d="M8 12h.01" stroke={color} />
      </Svg>
    )
  })
)
