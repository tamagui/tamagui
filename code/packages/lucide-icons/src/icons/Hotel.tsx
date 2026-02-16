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

export const Hotel: IconComponent = themed(
  memo(function Hotel(props: IconProps) {
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
        <Path d="M10 22v-6.57" stroke={color} />
        <Path d="M12 11h.01" stroke={color} />
        <Path d="M12 7h.01" stroke={color} />
        <Path d="M14 15.43V22" stroke={color} />
        <Path d="M15 16a5 5 0 0 0-6 0" stroke={color} />
        <Path d="M16 11h.01" stroke={color} />
        <Path d="M16 7h.01" stroke={color} />
        <Path d="M8 11h.01" stroke={color} />
        <Path d="M8 7h.01" stroke={color} />
        <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} />
      </Svg>
    )
  })
)
