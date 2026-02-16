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

export const FolderCog: IconComponent = themed(
  memo(function FolderCog(props: IconProps) {
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
        <Path
          d="M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3"
          stroke={color}
        />
        <Path d="m14.305 19.53.923-.382" stroke={color} />
        <Path d="m15.228 16.852-.923-.383" stroke={color} />
        <Path d="m16.852 15.228-.383-.923" stroke={color} />
        <Path d="m16.852 20.772-.383.924" stroke={color} />
        <Path d="m19.148 15.228.383-.923" stroke={color} />
        <Path d="m19.53 21.696-.382-.924" stroke={color} />
        <Path d="m20.772 16.852.924-.383" stroke={color} />
        <Path d="m20.772 19.148.924.383" stroke={color} />
        <_Circle cx="18" cy="18" r="3" stroke={color} />
      </Svg>
    )
  })
)
