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

export const Move: IconComponent = themed(
  memo(function Move(props: IconProps) {
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
        <Path d="m15 19-3 3-3-3" stroke={color} />
        <Path d="m19 9 3 3-3 3" stroke={color} />
        <Path d="M2 12h20" stroke={color} />
        <Path d="m5 9-3 3 3 3" stroke={color} />
        <Path d="m9 5 3-3 3 3" stroke={color} />
      </Svg>
    )
  })
)
