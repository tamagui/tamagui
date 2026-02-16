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

export const FileScan: IconComponent = themed(
  memo(function FileScan(props: IconProps) {
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
        <Path d="M20 10V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4" stroke={color} />
        <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
        <Path d="M16 14a2 2 0 0 0-2 2" stroke={color} />
        <Path d="M20 14a2 2 0 0 1 2 2" stroke={color} />
        <Path d="M20 22a2 2 0 0 0 2-2" stroke={color} />
        <Path d="M16 22a2 2 0 0 1-2-2" stroke={color} />
      </Svg>
    )
  })
)
