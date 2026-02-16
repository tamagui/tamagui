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

export const Haze: IconComponent = themed(
  memo(function Haze(props: IconProps) {
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
        <Path d="m5.2 6.2 1.4 1.4" stroke={color} />
        <Path d="M2 13h2" stroke={color} />
        <Path d="M20 13h2" stroke={color} />
        <Path d="m17.4 7.6 1.4-1.4" stroke={color} />
        <Path d="M22 17H2" stroke={color} />
        <Path d="M22 21H2" stroke={color} />
        <Path d="M16 13a4 4 0 0 0-8 0" stroke={color} />
        <Path d="M12 5V2.5" stroke={color} />
      </Svg>
    )
  })
)
