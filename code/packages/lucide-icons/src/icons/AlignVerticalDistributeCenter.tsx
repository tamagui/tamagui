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

export const AlignVerticalDistributeCenter: IconComponent = themed(
  memo(function AlignVerticalDistributeCenter(props: IconProps) {
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
        <Path d="M22 17h-3" stroke={color} />
        <Path d="M22 7h-5" stroke={color} />
        <Path d="M5 17H2" stroke={color} />
        <Path d="M7 7H2" stroke={color} />
        <Rect x="5" y="14" width="14" height="6" rx="2" stroke={color} />
        <Rect x="7" y="4" width="10" height="6" rx="2" stroke={color} />
      </Svg>
    )
  })
)
