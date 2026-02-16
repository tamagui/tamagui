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

export const DoorClosedLocked: IconComponent = themed(
  memo(function DoorClosedLocked(props: IconProps) {
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
        <Path d="M10 12h.01" stroke={color} />
        <Path d="M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" stroke={color} />
        <Path d="M2 20h8" stroke={color} />
        <Path d="M20 17v-2a2 2 0 1 0-4 0v2" stroke={color} />
        <Rect x="14" y="17" width="8" height="5" rx="1" stroke={color} />
      </Svg>
    )
  })
)
