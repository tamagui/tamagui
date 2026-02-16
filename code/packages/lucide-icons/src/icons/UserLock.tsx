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

export const UserLock: IconComponent = themed(
  memo(function UserLock(props: IconProps) {
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
        <_Circle cx="10" cy="7" r="4" stroke={color} />
        <Path d="M10.3 15H7a4 4 0 0 0-4 4v2" stroke={color} />
        <Path d="M15 15.5V14a2 2 0 0 1 4 0v1.5" stroke={color} />
        <Rect width="8" height="5" x="13" y="16" rx=".899" stroke={color} />
      </Svg>
    )
  })
)
