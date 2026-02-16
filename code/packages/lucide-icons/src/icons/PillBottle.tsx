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

export const PillBottle: IconComponent = themed(
  memo(function PillBottle(props: IconProps) {
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
        <Path d="M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" stroke={color} />
        <Path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" stroke={color} />
        <Rect width="16" height="5" x="4" y="2" rx="1" stroke={color} />
      </Svg>
    )
  })
)
