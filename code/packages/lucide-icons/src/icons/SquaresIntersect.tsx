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

export const SquaresIntersect: IconComponent = themed(
  memo(function SquaresIntersect(props: IconProps) {
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
        <Path d="M10 22a2 2 0 0 1-2-2" stroke={color} />
        <Path d="M14 2a2 2 0 0 1 2 2" stroke={color} />
        <Path d="M16 22h-2" stroke={color} />
        <Path d="M2 10V8" stroke={color} />
        <Path d="M2 4a2 2 0 0 1 2-2" stroke={color} />
        <Path d="M20 8a2 2 0 0 1 2 2" stroke={color} />
        <Path d="M22 14v2" stroke={color} />
        <Path d="M22 20a2 2 0 0 1-2 2" stroke={color} />
        <Path d="M4 16a2 2 0 0 1-2-2" stroke={color} />
        <Path
          d="M8 10a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H9a1 1 0 0 1-1-1z"
          stroke={color}
        />
        <Path d="M8 2h2" stroke={color} />
      </Svg>
    )
  })
)
