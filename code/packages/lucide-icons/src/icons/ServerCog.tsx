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

export const ServerCog: IconComponent = themed(
  memo(function ServerCog(props: IconProps) {
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
        <Path d="m10.852 14.772-.383.923" stroke={color} />
        <Path d="M13.148 14.772a3 3 0 1 0-2.296-5.544l-.383-.923" stroke={color} />
        <Path d="m13.148 9.228.383-.923" stroke={color} />
        <Path d="m13.53 15.696-.382-.924a3 3 0 1 1-2.296-5.544" stroke={color} />
        <Path d="m14.772 10.852.923-.383" stroke={color} />
        <Path d="m14.772 13.148.923.383" stroke={color} />
        <Path
          d="M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5"
          stroke={color}
        />
        <Path
          d="M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5"
          stroke={color}
        />
        <Path d="M6 18h.01" stroke={color} />
        <Path d="M6 6h.01" stroke={color} />
        <Path d="m9.228 10.852-.923-.383" stroke={color} />
        <Path d="m9.228 13.148-.923.383" stroke={color} />
      </Svg>
    )
  })
)
