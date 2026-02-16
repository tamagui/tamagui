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

export const Orbit: IconComponent = themed(
  memo(function Orbit(props: IconProps) {
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
        <Path d="M20.341 6.484A10 10 0 0 1 10.266 21.85" stroke={color} />
        <Path d="M3.659 17.516A10 10 0 0 1 13.74 2.152" stroke={color} />
        <_Circle cx="12" cy="12" r="3" stroke={color} />
        <_Circle cx="19" cy="5" r="2" stroke={color} />
        <_Circle cx="5" cy="19" r="2" stroke={color} />
      </Svg>
    )
  })
)
