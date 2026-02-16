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

export const EarthLock: IconComponent = themed(
  memo(function EarthLock(props: IconProps) {
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
        <Path d="M7 3.34V5a3 3 0 0 0 3 3" stroke={color} />
        <Path
          d="M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"
          stroke={color}
        />
        <Path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" stroke={color} />
        <Path d="M12 2a10 10 0 1 0 9.54 13" stroke={color} />
        <Path d="M20 6V4a2 2 0 1 0-4 0v2" stroke={color} />
        <Rect width="8" height="5" x="14" y="6" rx="1" stroke={color} />
      </Svg>
    )
  })
)
