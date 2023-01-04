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
      <_Path d="M226.7,218a8,8,0,0,1-7.7,10H157a8,8,0,0,1-7.7-10,40.2,40.2,0,0,1,16.3-23.2,32,32,0,1,1,44.8,0A40.2,40.2,0,0,1,226.7,218ZM232,88v32a8,8,0,0,1-16,0V88H40V200h80.6a8,8,0,1,1,0,16H39.4A15.4,15.4,0,0,1,24,200.6V56A16,16,0,0,1,40,40H92.7A15.9,15.9,0,0,1,104,44.7L131.3,72H216A16,16,0,0,1,232,88ZM40,56V72h68.7l-16-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'FolderUserFill'

export const FolderUserFill = memo<IconProps>(themed(Icon))
