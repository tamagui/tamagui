import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M104,54.6C75.9,75.2,55.7,115.4,64,192h0c76.6,8.3,116.8-11.9,137.4-40h-.1A96,96,0,0,1,104,54.6Z"
        opacity="0.2"
      />
      <_Circle cx="156" cy="76" r="12" />
      <_Path
        d="M16,184C247.8,234.7,223.8,75.5,217.2,45a8.2,8.2,0,0,0-6.2-6.2C180.5,32.2,21.3,8.2,72,240"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M201.3,152A96,96,0,0,1,104,54.6"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'FishSimpleDuotone'

export const FishSimpleDuotone = memo<IconProps>(themed(Icon))
