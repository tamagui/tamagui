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

export const TouchpadOff: IconComponent = themed(
  memo(function TouchpadOff(props: IconProps) {
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
        <Path d="M12 20v-6" stroke={color} />
        <Path d="M19.656 14H22" stroke={color} />
        <Path d="M2 14h12" stroke={color} />
        <Path d="m2 2 20 20" stroke={color} />
        <Path d="M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" stroke={color} />
        <Path d="M9.656 4H20a2 2 0 0 1 2 2v10.344" stroke={color} />
      </Svg>
    )
  })
)
