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

export const UserCog: IconComponent = themed(
  memo(function UserCog(props: IconProps) {
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
        <Path d="M10 15H6a4 4 0 0 0-4 4v2" stroke={color} />
        <Path d="m14.305 16.53.923-.382" stroke={color} />
        <Path d="m15.228 13.852-.923-.383" stroke={color} />
        <Path d="m16.852 12.228-.383-.923" stroke={color} />
        <Path d="m16.852 17.772-.383.924" stroke={color} />
        <Path d="m19.148 12.228.383-.923" stroke={color} />
        <Path d="m19.53 18.696-.382-.924" stroke={color} />
        <Path d="m20.772 13.852.924-.383" stroke={color} />
        <Path d="m20.772 16.148.924.383" stroke={color} />
        <_Circle cx="18" cy="15" r="3" stroke={color} />
        <_Circle cx="9" cy="7" r="4" stroke={color} />
      </Svg>
    )
  })
)
