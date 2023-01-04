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
        d="M177,68.8h0A56.7,56.7,0,0,1,184,96v3.9a15.8,15.8,0,0,1-12.4,15.5A191.4,191.4,0,0,1,128,120a191.4,191.4,0,0,1-43.6-4.6A15.8,15.8,0,0,1,72,99.9V96.8a56.8,56.8,0,0,1,7.4-28h0C41.9,76.5,16,93,16,112c0,26.5,50.1,48,112,48s112-21.5,112-48C240,93,214.3,76.6,177,68.8Z"
        opacity="0.2"
      />
      <_Line
        x1="168.8"
        y1="188.7"
        x2="172.7"
        y2="212.3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="128"
        y1="192"
        x2="128"
        y2="224"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="87.2"
        y1="188.7"
        x2="83.3"
        y2="212.3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M177,68.8c37.3,7.8,63,24.2,63,43.2,0,26.5-50.1,48-112,48S16,138.5,16,112c0-19,25.9-35.5,63.4-43.2"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M72,99.9a15.8,15.8,0,0,0,12.4,15.5A191.4,191.4,0,0,0,128,120a191.4,191.4,0,0,0,43.6-4.6A15.8,15.8,0,0,0,184,99.9V96a56,56,0,0,0-56.7-56C96.5,40.4,72,66.1,72,96.8Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'FlyingSaucerDuotone'

export const FlyingSaucerDuotone = memo<IconProps>(themed(Icon))
