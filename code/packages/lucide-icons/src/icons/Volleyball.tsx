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

export const Volleyball: IconComponent = themed(
  memo(function Volleyball(props: IconProps) {
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
        <Path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" stroke={color} />
        <Path d="M12 12a12.6 12.6 0 0 1-8.7 5" stroke={color} />
        <Path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" stroke={color} />
        <Path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" stroke={color} />
        <Path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" stroke={color} />
        <_Circle cx="12" cy="12" r="10" stroke={color} />
      </Svg>
    )
  })
)
