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

export const UtilityPole: IconComponent = themed(
  memo(function UtilityPole(props: IconProps) {
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
        <Path d="M12 2v20" stroke={color} />
        <Path d="M2 5h20" stroke={color} />
        <Path d="M3 3v2" stroke={color} />
        <Path d="M7 3v2" stroke={color} />
        <Path d="M17 3v2" stroke={color} />
        <Path d="M21 3v2" stroke={color} />
        <Path d="m19 5-7 7-7-7" stroke={color} />
      </Svg>
    )
  })
)
