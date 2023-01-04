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
      <_Path d="M40,80H88V48a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8Z" opacity="0.2" />
      <_Path d="M88,176h48V48a8,8,0,0,0-8-8H96a8,8,0,0,0-8,8Z" opacity="0.2" />
      <_Path
        d="M171.2,179.2l46.4-12.5,8.3,30.9a8,8,0,0,1-5.7,9.8l-30.9,8.3a8,8,0,0,1-9.8-5.6Z"
        opacity="0.2"
      />
      <_Path
        d="M146.4,86.4,192.8,74l-8.3-30.9a8.1,8.1,0,0,0-9.8-5.7l-30.9,8.3a8.1,8.1,0,0,0-5.7,9.8Z"
        opacity="0.2"
      />
      <_Rect
        x="40"
        y="40"
        width="48"
        height="176"
        rx="8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="40"
        y1="80"
        x2="88"
        y2="80"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Rect
        x="88"
        y="40"
        width="48"
        height="176"
        rx="8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="88"
        y1="176"
        x2="136"
        y2="176"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Rect
        x="158"
        y="38.6"
        width="48"
        height="176"
        rx="8"
        transform="translate(-26.6 51.4) rotate(-15)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="171.2"
        y1="179.2"
        x2="217.6"
        y2="166.7"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="146.4"
        y1="86.4"
        x2="192.8"
        y2="74"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'BooksDuotone'

export const BooksDuotone = memo<IconProps>(themed(Icon))
