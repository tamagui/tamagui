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

export const TextCursorInput: IconComponent = themed(
  memo(function TextCursorInput(props: IconProps) {
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
        <Path d="M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6" stroke={color} />
        <Path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" stroke={color} />
        <Path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" stroke={color} />
        <Path d="M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1" stroke={color} />
        <Path d="M9 6v12" stroke={color} />
      </Svg>
    )
  })
)
