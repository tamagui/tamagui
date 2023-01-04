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
      <_Path d="M232,144a64.1,64.1,0,0,1-64,64H80a8,8,0,0,1,0-16h88a48,48,0,0,0,0-96H88v40a8,8,0,0,1-4.9,7.4,8.5,8.5,0,0,1-3.1.6,8.3,8.3,0,0,1-5.7-2.3l-48-48a8.1,8.1,0,0,1,0-11.4l48-48a8.4,8.4,0,0,1,8.8-1.7A8,8,0,0,1,88,40V80h80A64.1,64.1,0,0,1,232,144Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowUUpLeftFill'

export const ArrowUUpLeftFill = memo<IconProps>(themed(Icon))
