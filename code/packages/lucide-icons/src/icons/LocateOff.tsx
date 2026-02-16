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

export const LocateOff: IconComponent = themed(
  memo(function LocateOff(props: IconProps) {
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
        <Path d="M12 19v3" stroke={color} />
        <Path d="M12 2v3" stroke={color} />
        <Path d="M18.89 13.24a7 7 0 0 0-8.13-8.13" stroke={color} />
        <Path d="M19 12h3" stroke={color} />
        <Path d="M2 12h3" stroke={color} />
        <Path d="m2 2 20 20" stroke={color} />
        <Path d="M7.05 7.05a7 7 0 0 0 9.9 9.9" stroke={color} />
      </Svg>
    )
  })
)
