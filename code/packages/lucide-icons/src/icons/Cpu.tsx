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

export const Cpu: IconComponent = themed(
  memo(function Cpu(props: IconProps) {
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
        <Path d="M12 20v2" stroke={color} />
        <Path d="M12 2v2" stroke={color} />
        <Path d="M17 20v2" stroke={color} />
        <Path d="M17 2v2" stroke={color} />
        <Path d="M2 12h2" stroke={color} />
        <Path d="M2 17h2" stroke={color} />
        <Path d="M2 7h2" stroke={color} />
        <Path d="M20 12h2" stroke={color} />
        <Path d="M20 17h2" stroke={color} />
        <Path d="M20 7h2" stroke={color} />
        <Path d="M7 20v2" stroke={color} />
        <Path d="M7 2v2" stroke={color} />
        <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} />
        <Rect x="8" y="8" width="8" height="8" rx="1" stroke={color} />
      </Svg>
    )
  })
)
