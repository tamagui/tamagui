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

export const Transgender: IconComponent = themed(
  memo(function Transgender(props: IconProps) {
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
        <Path d="M12 16v6" stroke={color} />
        <Path d="M14 20h-4" stroke={color} />
        <Path d="M18 2h4v4" stroke={color} />
        <Path d="m2 2 7.17 7.17" stroke={color} />
        <Path d="M2 5.355V2h3.357" stroke={color} />
        <Path d="m22 2-7.17 7.17" stroke={color} />
        <Path d="M8 5 5 8" stroke={color} />
        <_Circle cx="12" cy="12" r="4" stroke={color} />
      </Svg>
    )
  })
)
