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

export const BrainCog: IconComponent = themed(
  memo(function BrainCog(props: IconProps) {
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
        <Path d="m10.852 9.228-.383-.923" stroke={color} />
        <Path d="m13.148 14.772.382.924" stroke={color} />
        <Path d="m13.531 8.305-.383.923" stroke={color} />
        <Path d="m14.772 10.852.923-.383" stroke={color} />
        <Path d="m14.772 13.148.923.383" stroke={color} />
        <Path
          d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771"
          stroke={color}
        />
        <Path d="M17.998 5.125a4 4 0 0 1 2.525 5.771" stroke={color} />
        <Path d="M19.505 10.294a4 4 0 0 1-1.5 7.706" stroke={color} />
        <Path
          d="M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516"
          stroke={color}
        />
        <Path d="M4.5 10.291A4 4 0 0 0 6 18" stroke={color} />
        <Path d="M6.002 5.125a3 3 0 0 0 .4 1.375" stroke={color} />
        <Path d="m9.228 10.852-.923-.383" stroke={color} />
        <Path d="m9.228 13.148-.923.383" stroke={color} />
        <_Circle cx="12" cy="12" r="3" stroke={color} />
      </Svg>
    )
  })
)
