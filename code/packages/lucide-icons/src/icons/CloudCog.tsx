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

export const CloudCog: IconComponent = themed(
  memo(function CloudCog(props: IconProps) {
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
        <Path d="m10.852 19.772-.383.924" stroke={color} />
        <Path d="m13.148 14.228.383-.923" stroke={color} />
        <Path d="M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923" stroke={color} />
        <Path d="m13.53 20.696-.382-.924a3 3 0 1 1-2.296-5.544" stroke={color} />
        <Path d="m14.772 15.852.923-.383" stroke={color} />
        <Path d="m14.772 18.148.923.383" stroke={color} />
        <Path
          d="M4.2 15.1a7 7 0 1 1 9.93-9.858A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2"
          stroke={color}
        />
        <Path d="m9.228 15.852-.923-.383" stroke={color} />
        <Path d="m9.228 18.148-.923.383" stroke={color} />
      </Svg>
    )
  })
)
