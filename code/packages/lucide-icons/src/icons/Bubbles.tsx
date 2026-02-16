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

export const Bubbles: IconComponent = themed(
  memo(function Bubbles(props: IconProps) {
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
        <Path d="M7.2 14.8a2 2 0 0 1 2 2" stroke={color} />
        <_Circle cx="18.5" cy="8.5" r="3.5" stroke={color} />
        <_Circle cx="7.5" cy="16.5" r="5.5" stroke={color} />
        <_Circle cx="7.5" cy="4.5" r="2.5" stroke={color} />
      </Svg>
    )
  })
)
