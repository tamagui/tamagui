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

export const ScanHeart: IconComponent = themed(
  memo(function ScanHeart(props: IconProps) {
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
        <Path
          d="M11.246 16.657a1 1 0 0 0 1.508 0l3.57-4.101A2.75 2.75 0 1 0 12 9.168a2.75 2.75 0 1 0-4.324 3.388z"
          stroke={color}
        />
        <Path d="M17 3h2a2 2 0 0 1 2 2v2" stroke={color} />
        <Path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke={color} />
        <Path d="M3 7V5a2 2 0 0 1 2-2h2" stroke={color} />
        <Path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke={color} />
      </Svg>
    )
  })
)
