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
      <_Path d="M200,80H184V64a32,32,0,0,0-56-21.1A31.8,31.8,0,0,0,104,32,32.1,32.1,0,0,0,72.2,60.4,32,32,0,0,0,24,88v40a104,104,0,0,0,208,0V112A32.1,32.1,0,0,0,200,80ZM152,48a16,16,0,0,1,16,16V80H136V64A16,16,0,0,1,152,48ZM88,64a16,16,0,0,1,32,0v40a16,16,0,0,1-32,0ZM40,88a16,16,0,0,1,32,0v16a16,16,0,0,1-32,0Zm88,128a88,88,0,0,1-87.9-84.2A32,32,0,0,0,80,125.1a31.9,31.9,0,0,0,44.6,3.4,32.3,32.3,0,0,0,11.8,11.4A47.7,47.7,0,0,0,120,176a8,8,0,0,0,16,0,32.1,32.1,0,0,1,32-32,8,8,0,0,0,0-16H152a16,16,0,0,1-16-16V96h64a16,16,0,0,1,16,16v16A88.1,88.1,0,0,1,128,216Z" />
    </_Svg>
  )
}

Icon.displayName = 'HandFistFill'

export const HandFistFill = memo<IconProps>(themed(Icon))
