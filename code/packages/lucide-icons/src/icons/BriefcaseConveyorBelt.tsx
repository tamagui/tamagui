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

export const BriefcaseConveyorBelt: IconComponent = themed(
  memo(function BriefcaseConveyorBelt(props: IconProps) {
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
        <Path d="M10 20v2" stroke={color} />
        <Path d="M14 20v2" stroke={color} />
        <Path d="M18 20v2" stroke={color} />
        <Path d="M21 20H3" stroke={color} />
        <Path d="M6 20v2" stroke={color} />
        <Path d="M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12" stroke={color} />
        <Rect x="4" y="6" width="16" height="10" rx="2" stroke={color} />
      </Svg>
    )
  })
)
