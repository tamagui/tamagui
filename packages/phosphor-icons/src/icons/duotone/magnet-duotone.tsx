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
        d="M126.8,162.4l39.8,39.8-32.9,32.3a8.1,8.1,0,0,1-11.3-.1L93.7,205.7a8.1,8.1,0,0,1,.1-11.4Z"
        opacity="0.2"
      />
      <_Path
        d="M93.7,129.4,54,89.6,21.6,122.3a8,8,0,0,0,0,11.3l28.7,28.7a8.1,8.1,0,0,0,11.4-.1Z"
        opacity="0.2"
      />
      <_Path
        d="M127.3,95a24.1,24.1,0,0,1,33.6-.3c9.7,9.3,9.5,25.1-.1,34.7l-67,64.9a8.1,8.1,0,0,0-.1,11.4l28.7,28.7a8.1,8.1,0,0,0,11.3.1l66.4-65.2c31.2-31.2,32.1-82,1.2-113.4a80,80,0,0,0-113.6-.5L21.6,122.3a8,8,0,0,0,0,11.3l28.7,28.7a8.1,8.1,0,0,0,11.4-.1Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="126.8"
        y1="162.4"
        x2="166.6"
        y2="202.2"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="54"
        y1="89.6"
        x2="93.7"
        y2="129.4"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'MagnetDuotone'

export const MagnetDuotone = memo<IconProps>(themed(Icon))
