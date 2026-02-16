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

export const BellElectric: IconComponent = themed(
  memo(function BellElectric(props: IconProps) {
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
        <Path d="M18.518 17.347A7 7 0 0 1 14 19" stroke={color} />
        <Path d="M18.8 4A11 11 0 0 1 20 9" stroke={color} />
        <Path d="M9 9h.01" stroke={color} />
        <_Circle cx="20" cy="16" r="2" stroke={color} />
        <_Circle cx="9" cy="9" r="7" stroke={color} />
        <Rect x="4" y="16" width="10" height="6" rx="2" stroke={color} />
      </Svg>
    )
  })
)
