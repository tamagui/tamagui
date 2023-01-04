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
      <_Path d="M50.4,33.8a8,8,0,0,1,11-11.6L80.1,40a79.8,79.8,0,0,1,95.7-.1l18.6-17.7a8,8,0,0,1,11.3.3,7.9,7.9,0,0,1-.3,11.3L187.6,50.7a79.6,79.6,0,0,1,20,45.3H48.4A79.9,79.9,0,0,1,68.3,50.8ZM32,96a8,8,0,0,0,0,16H48V96Zm176,56a70.3,70.3,0,0,1-.4,8H224a8,8,0,0,1,0,16H204.3a80,80,0,0,1-152.6,0H32a8,8,0,0,1,0-16H48.4a70.3,70.3,0,0,1-.4-8v-8H32a8,8,0,0,1,0-16H48V112H208v16h16a8,8,0,0,1,0,16H208Zm-72-16a8,8,0,0,0-16,0v64a8,8,0,0,0,16,0Zm96-32a8,8,0,0,0-8-8H208v16h16A8,8,0,0,0,232,104Z" />
    </_Svg>
  )
}

Icon.displayName = 'BugBeetleFill'

export const BugBeetleFill = memo<IconProps>(themed(Icon))
