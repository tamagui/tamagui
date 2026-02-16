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

export const LoaderPinwheel: IconComponent = themed(
  memo(function LoaderPinwheel(props: IconProps) {
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
        <Path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" stroke={color} />
        <Path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" stroke={color} />
        <Path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" stroke={color} />
        <_Circle cx="12" cy="12" r="10" stroke={color} />
      </Svg>
    )
  })
)
