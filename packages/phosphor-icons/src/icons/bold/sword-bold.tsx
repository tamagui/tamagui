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
      <_Polyline
        points="72.2 128.2 152.2 40.2 216 40 215.8 103.8 127.8 183.8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
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
        strokeWidth="24"
      />
      <_Path
        d="M82.1,205.5,60.2,227.4a8,8,0,0,1-11.3,0L28.6,207.1a8,8,0,0,1,0-11.3l21.9-21.9a8,8,0,0,0,0-11.4L33.7,145.7a8,8,0,0,1,0-11.4l16.6-16.6a8,8,0,0,1,11.4,0l76.6,76.6a8,8,0,0,1,0,11.4l-16.6,16.6a8,8,0,0,1-11.4,0L93.5,205.5A8,8,0,0,0,82.1,205.5Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'SwordBold'

export const SwordBold = memo<IconProps>(themed(Icon))
