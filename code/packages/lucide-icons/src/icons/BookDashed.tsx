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

export const BookDashed: IconComponent = themed(
  memo(function BookDashed(props: IconProps) {
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
        <Path d="M12 17h1.5" stroke={color} />
        <Path d="M12 22h1.5" stroke={color} />
        <Path d="M12 2h1.5" stroke={color} />
        <Path d="M17.5 22H19a1 1 0 0 0 1-1" stroke={color} />
        <Path d="M17.5 2H19a1 1 0 0 1 1 1v1.5" stroke={color} />
        <Path d="M20 14v3h-2.5" stroke={color} />
        <Path d="M20 8.5V10" stroke={color} />
        <Path d="M4 10V8.5" stroke={color} />
        <Path d="M4 19.5V14" stroke={color} />
        <Path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H8" stroke={color} />
        <Path d="M8 22H6.5a1 1 0 0 1 0-5H8" stroke={color} />
      </Svg>
    )
  })
)
