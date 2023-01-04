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
        d="M216,136c0,51.5-74.4,69.2-86.4,71.7a8.6,8.6,0,0,1-3.2,0C114.4,205.2,40,187.5,40,136V77.6a7.9,7.9,0,0,1,5.3-7.5l80-29.1a8.3,8.3,0,0,1,5.4,0l80,29.1a7.9,7.9,0,0,1,5.3,7.5Z"
        opacity="0.2"
      />
      <_Path
        d="M216,136c0,51.5-74.4,69.2-86.4,71.7a8.6,8.6,0,0,1-3.2,0C114.4,205.2,40,187.5,40,136V77.6a7.9,7.9,0,0,1,5.3-7.5l80-29.1a8.3,8.3,0,0,1,5.4,0l80,29.1a7.9,7.9,0,0,1,5.3,7.5Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="88"
        y1="112"
        x2="168"
        y2="112"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="88"
        y1="144"
        x2="168"
        y2="144"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M213.4,152H224a23.9,23.9,0,0,0,24-24V104a23.9,23.9,0,0,0-24-24h-8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M42.6,152H32A23.9,23.9,0,0,1,8,128V104A23.9,23.9,0,0,1,32,80h8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'FaceMaskDuotone'

export const FaceMaskDuotone = memo<IconProps>(themed(Icon))
