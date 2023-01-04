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
        d="M128,24a88,88,0,0,0-88,88c0,48.6,56,120,88,120s88-71.4,88-120A88,88,0,0,0,128,24ZM112,140a8,8,0,0,1-8,8,32,32,0,0,1-32-32v-4a8,8,0,0,1,8-8,32,32,0,0,1,32,32Zm72-24a32,32,0,0,1-32,32,8,8,0,0,1-8-8v-4a32,32,0,0,1,32-32,8,8,0,0,1,8,8Z"
        opacity="0.2"
      />
      <_Path
        d="M216,112c0,48.6-56,120-88,120S40,160.6,40,112a88,88,0,0,1,176,0Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M80,104h0a32,32,0,0,1,32,32v4a8,8,0,0,1-8,8h0a32,32,0,0,1-32-32v-4a8,8,0,0,1,8-8Z"
        transform="translate(184 252) rotate(-180)"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M176,104h0a8,8,0,0,1,8,8v4a32,32,0,0,1-32,32h0a8,8,0,0,1-8-8v-4A32,32,0,0,1,176,104Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="112"
        y1="184"
        x2="144"
        y2="184"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'AlienDuotone'

export const AlienDuotone = memo<IconProps>(themed(Icon))
