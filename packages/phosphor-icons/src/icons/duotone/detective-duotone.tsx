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
      <_Circle cx="76" cy="180" r="28" opacity="0.2" />
      <_Circle cx="180" cy="180" r="28" opacity="0.2" />
      <_Path
        d="M40,120,89.3,49.6a8,8,0,0,1,13.2.1L121.3,78a8,8,0,0,0,13.4,0l18.8-28.3a8,8,0,0,1,13.2-.1L216,120Z"
        opacity="0.2"
      />
      <_Circle
        cx="76"
        cy="180"
        r="28"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle
        cx="180"
        cy="180"
        r="28"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="104"
        y1="180"
        x2="152"
        y2="180"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="8"
        y1="120"
        x2="248"
        y2="120"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M40,120,89.3,49.6a8,8,0,0,1,13.2.1L121.3,78a8,8,0,0,0,13.4,0l18.8-28.3a8,8,0,0,1,13.2-.1L216,120"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'DetectiveDuotone'

export const DetectiveDuotone = memo<IconProps>(themed(Icon))
