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

export const MonitorCog: IconComponent = themed(
  memo(function MonitorCog(props: IconProps) {
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
        <Path d="M12 17v4" stroke={color} />
        <Path d="m14.305 7.53.923-.382" stroke={color} />
        <Path d="m15.228 4.852-.923-.383" stroke={color} />
        <Path d="m16.852 3.228-.383-.924" stroke={color} />
        <Path d="m16.852 8.772-.383.923" stroke={color} />
        <Path d="m19.148 3.228.383-.924" stroke={color} />
        <Path d="m19.53 9.696-.382-.924" stroke={color} />
        <Path d="m20.772 4.852.924-.383" stroke={color} />
        <Path d="m20.772 7.148.924.383" stroke={color} />
        <Path
          d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"
          stroke={color}
        />
        <Path d="M8 21h8" stroke={color} />
        <_Circle cx="18" cy="6" r="3" stroke={color} />
      </Svg>
    )
  })
)
