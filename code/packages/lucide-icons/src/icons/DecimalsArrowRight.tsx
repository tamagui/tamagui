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

export const DecimalsArrowRight: IconComponent = themed(
  memo(function DecimalsArrowRight(props: IconProps) {
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
        <Path d="M10 18h10" stroke={color} />
        <Path d="m17 21 3-3-3-3" stroke={color} />
        <Path d="M3 11h.01" stroke={color} />
        <Rect x="15" y="3" width="5" height="8" rx="2.5" stroke={color} />
        <Rect x="6" y="3" width="5" height="8" rx="2.5" stroke={color} />
      </Svg>
    )
  })
)
