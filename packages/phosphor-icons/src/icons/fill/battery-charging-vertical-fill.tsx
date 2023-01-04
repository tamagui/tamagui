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
      <_Path d="M96,16h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Z" />
      <_Path d="M184,32H72A24.1,24.1,0,0,0,48,56V208a24.1,24.1,0,0,0,24,24H184a24.1,24.1,0,0,0,24-24V56A24.1,24.1,0,0,0,184,32ZM151.4,135l-16,40a7.9,7.9,0,0,1-7.4,5,8,8,0,0,1-3-.6,7.9,7.9,0,0,1-4.4-10.4l11.6-29H112a7.9,7.9,0,0,1-6.6-3.5,8,8,0,0,1-.8-7.5l16-40a8,8,0,1,1,14.8,6l-11.6,29H144a7.9,7.9,0,0,1,6.6,3.5A8,8,0,0,1,151.4,135Z" />
    </_Svg>
  )
}

Icon.displayName = 'BatteryChargingVerticalFill'

export const BatteryChargingVerticalFill = memo<IconProps>(themed(Icon))
