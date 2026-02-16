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

export const DraftingCompass: IconComponent = themed(
  memo(function DraftingCompass(props: IconProps) {
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
        <Path d="m12.99 6.74 1.93 3.44" stroke={color} />
        <Path d="M19.136 12a10 10 0 0 1-14.271 0" stroke={color} />
        <Path d="m21 21-2.16-3.84" stroke={color} />
        <Path d="m3 21 8.02-14.26" stroke={color} />
        <_Circle cx="12" cy="5" r="2" stroke={color} />
      </Svg>
    )
  })
)
