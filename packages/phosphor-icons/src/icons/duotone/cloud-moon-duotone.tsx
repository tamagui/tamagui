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
        d="M90.3,130.4a67.9,67.9,0,0,1,45.5-47.3h.1c.1-1,.1-2,.1-3A64,64,0,0,0,86.4,17.6h0A68.3,68.3,0,0,1,88,32,64.1,64.1,0,0,1,24,96,68.3,68.3,0,0,1,9.6,94.4h0A64.1,64.1,0,0,0,47,138.9h0A43.7,43.7,0,0,1,76,128a42.5,42.5,0,0,1,14.3,2.4Z"
        opacity="0.2"
      />
      <_Path
        d="M88,148a68,68,0,1,1,68,68H76a44,44,0,0,1,0-88,42.5,42.5,0,0,1,14.3,2.4"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M47,138.9A64.1,64.1,0,0,1,9.6,94.4h0A68.3,68.3,0,0,0,24,96,64.1,64.1,0,0,0,88,32a68.3,68.3,0,0,0-1.6-14.4h0A64,64,0,0,1,136,80c0,1,0,2-.1,3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'CloudMoonDuotone'

export const CloudMoonDuotone = memo<IconProps>(themed(Icon))
