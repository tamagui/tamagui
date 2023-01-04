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
        d="M56.2,104a71.8,71.8,0,0,1,72.3-72c39.6.3,71.3,33.2,71.3,72.9V112c0,35.8,7.5,56.6,14.1,67.9A8,8,0,0,1,207,192H49a8,8,0,0,1-6.9-12.1c6.6-11.3,14.1-32.1,14.1-67.9Z"
        opacity="0.2"
      />
      <_Line
        x1="48"
        y1="40"
        x2="208"
        y2="216"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M96,192v8a32,32,0,0,0,64,0v-8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M186.2,192H49a8,8,0,0,1-6.9-12c6.6-11.4,14.1-32.2,14.1-68v-8A72.4,72.4,0,0,1,68.9,63"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M92.5,41.4a70.8,70.8,0,0,1,36-9.4c39.6.3,71.3,33.2,71.3,72.9V112c0,26.7,4.2,45,9,57.3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'BellSlashDuotone'

export const BellSlashDuotone = memo<IconProps>(themed(Icon))
