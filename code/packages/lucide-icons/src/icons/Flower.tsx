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

export const Flower: IconComponent = themed(
  memo(function Flower(props: IconProps) {
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
        <_Circle cx="12" cy="12" r="3" stroke={color} />
        <Path
          d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"
          stroke={color}
        />
        <Path d="M12 7.5V9" stroke={color} />
        <Path d="M7.5 12H9" stroke={color} />
        <Path d="M16.5 12H15" stroke={color} />
        <Path d="M12 16.5V15" stroke={color} />
        <Path d="m8 8 1.88 1.88" stroke={color} />
        <Path d="M14.12 9.88 16 8" stroke={color} />
        <Path d="m8 16 1.88-1.88" stroke={color} />
        <Path d="M14.12 14.12 16 16" stroke={color} />
      </Svg>
    )
  })
)
