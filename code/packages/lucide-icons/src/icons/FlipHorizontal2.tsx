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

export const FlipHorizontal2: IconComponent = themed(
  memo(function FlipHorizontal2(props: IconProps) {
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
        <Path d="m3 7 5 5-5 5V7" stroke={color} />
        <Path d="m21 7-5 5 5 5V7" stroke={color} />
        <Path d="M12 20v2" stroke={color} />
        <Path d="M12 14v2" stroke={color} />
        <Path d="M12 8v2" stroke={color} />
        <Path d="M12 2v2" stroke={color} />
      </Svg>
    )
  })
)
