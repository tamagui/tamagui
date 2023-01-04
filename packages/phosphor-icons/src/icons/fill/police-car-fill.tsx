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
      <_Path d="M96,32a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,32Zm152,88a8,8,0,0,1-8,8h-8v80a16,16,0,0,1-16,16H192a16,16,0,0,1-16-16V192H80v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V128H16a8,8,0,0,1,0-16H27.4L54.8,64.1A15.9,15.9,0,0,1,68.6,56H187.4a15.9,15.9,0,0,1,13.8,8.1L228.6,112H240A8,8,0,0,1,248,120ZM88,152a8,8,0,0,0-8-8H64a8,8,0,0,0,0,16H80A8,8,0,0,0,88,152Zm112,0a8,8,0,0,0-8-8H176a8,8,0,0,0,0,16h16A8,8,0,0,0,200,152Z" />
    </_Svg>
  )
}

Icon.displayName = 'PoliceCarFill'

export const PoliceCarFill = memo<IconProps>(themed(Icon))
