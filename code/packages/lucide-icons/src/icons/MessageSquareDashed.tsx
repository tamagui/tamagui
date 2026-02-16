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

export const MessageSquareDashed: IconComponent = themed(
  memo(function MessageSquareDashed(props: IconProps) {
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
        <Path d="M10 17H7l-4 4v-7" stroke={color} />
        <Path d="M14 17h1" stroke={color} />
        <Path d="M14 3h1" stroke={color} />
        <Path d="M19 3a2 2 0 0 1 2 2" stroke={color} />
        <Path d="M21 14v1a2 2 0 0 1-2 2" stroke={color} />
        <Path d="M21 9v1" stroke={color} />
        <Path d="M3 9v1" stroke={color} />
        <Path d="M5 3a2 2 0 0 0-2 2" stroke={color} />
        <Path d="M9 3h1" stroke={color} />
      </Svg>
    )
  })
)
