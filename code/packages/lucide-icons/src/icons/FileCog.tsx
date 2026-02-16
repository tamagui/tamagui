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

export const FileCog: IconComponent = themed(
  memo(function FileCog(props: IconProps) {
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
        <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
        <Path d="m2.305 15.53.923-.382" stroke={color} />
        <Path d="m3.228 12.852-.924-.383" stroke={color} />
        <Path
          d="M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5"
          stroke={color}
        />
        <Path d="m4.852 11.228-.383-.923" stroke={color} />
        <Path d="m4.852 16.772-.383.924" stroke={color} />
        <Path d="m7.148 11.228.383-.923" stroke={color} />
        <Path d="m7.53 17.696-.382-.924" stroke={color} />
        <Path d="m8.772 12.852.923-.383" stroke={color} />
        <Path d="m8.772 15.148.923.383" stroke={color} />
        <_Circle cx="6" cy="14" r="3" stroke={color} />
      </Svg>
    )
  })
)
