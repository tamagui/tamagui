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
        d="M82.1,197.5,52.2,227.4a8,8,0,0,1-11.3,0L28.6,215.1a8,8,0,0,1,0-11.3l29.9-29.9a8,8,0,0,0,0-11.4L37.7,141.7a8,8,0,0,1,0-11.4l12.6-12.6a8,8,0,0,1,11.4,0l76.6,76.6a8,8,0,0,1,0,11.4l-12.6,12.6a8,8,0,0,1-11.4,0L93.5,197.5A8,8,0,0,0,82.1,197.5Z"
        opacity="0.2"
      />
      <_Polyline
        points="76.2 132.2 152.2 40.2 216 40 215.8 103.8 123.8 179.8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="100"
        y1="156"
        x2="160"
        y2="96"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M82.1,197.5,52.2,227.4a8,8,0,0,1-11.3,0L28.6,215.1a8,8,0,0,1,0-11.3l29.9-29.9a8,8,0,0,0,0-11.4L37.7,141.7a8,8,0,0,1,0-11.4l12.6-12.6a8,8,0,0,1,11.4,0l76.6,76.6a8,8,0,0,1,0,11.4l-12.6,12.6a8,8,0,0,1-11.4,0L93.5,197.5A8,8,0,0,0,82.1,197.5Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'SwordDuotone'

export const SwordDuotone = memo<IconProps>(themed(Icon))
