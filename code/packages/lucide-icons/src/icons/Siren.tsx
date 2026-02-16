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

export const Siren: IconComponent = themed(
  memo(function Siren(props: IconProps) {
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
        <Path d="M7 18v-6a5 5 0 1 1 10 0v6" stroke={color} />
        <Path
          d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"
          stroke={color}
        />
        <Path d="M21 12h1" stroke={color} />
        <Path d="M18.5 4.5 18 5" stroke={color} />
        <Path d="M2 12h1" stroke={color} />
        <Path d="M12 2v1" stroke={color} />
        <Path d="m4.929 4.929.707.707" stroke={color} />
        <Path d="M12 12v6" stroke={color} />
      </Svg>
    )
  })
)
