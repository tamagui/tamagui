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

export const CalendarSync: IconComponent = themed(
  memo(function CalendarSync(props: IconProps) {
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
        <Path d="M11 10v4h4" stroke={color} />
        <Path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5" stroke={color} />
        <Path d="M16 2v4" stroke={color} />
        <Path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5" stroke={color} />
        <Path d="M21 22v-4h-4" stroke={color} />
        <Path
          d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3"
          stroke={color}
        />
        <Path d="M3 10h4" stroke={color} />
        <Path d="M8 2v4" stroke={color} />
      </Svg>
    )
  })
)
