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

export const TriangleDashed: IconComponent = themed(
  memo(function TriangleDashed(props: IconProps) {
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
        <Path d="M10.17 4.193a2 2 0 0 1 3.666.013" stroke={color} />
        <Path d="M14 21h2" stroke={color} />
        <Path d="m15.874 7.743 1 1.732" stroke={color} />
        <Path d="m18.849 12.952 1 1.732" stroke={color} />
        <Path d="M21.824 18.18a2 2 0 0 1-1.835 2.824" stroke={color} />
        <Path d="M4.024 21a2 2 0 0 1-1.839-2.839" stroke={color} />
        <Path d="m5.136 12.952-1 1.732" stroke={color} />
        <Path d="M8 21h2" stroke={color} />
        <Path d="m8.102 7.743-1 1.732" stroke={color} />
      </Svg>
    )
  })
)
