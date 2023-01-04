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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Path
        d="M179.8,115.8l4.9,4.9a16.1,16.1,0,0,1,0,22.6l-7,7a8,8,0,0,1-11.4,0L105.7,89.7a8,8,0,0,1,0-11.4l7-7a16.1,16.1,0,0,1,22.6,0l4.9,4.9,27.6-27.6c10.8-10.8,28.4-11.4,39.4-.9a28,28,0,0,1,.6,40.1Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M158.6,142.6l-56,56a31.7,31.7,0,0,1-30.9,8.3L48.3,217.1a8,8,0,0,1-8.8-1.6h0a5.7,5.7,0,0,1-1.2-6.4l10.8-24.8a31.7,31.7,0,0,1,8.3-30.9l56-56"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Line
        x1="52.3"
        y1="160"
        x2="141.3"
        y2="160"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'EyedropperSampleBold'

export const EyedropperSampleBold = memo<IconProps>(themed(Icon))
