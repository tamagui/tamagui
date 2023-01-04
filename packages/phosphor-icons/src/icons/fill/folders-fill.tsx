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
      <_Path d="M224,64H154.7L126.9,43.2a15.6,15.6,0,0,0-9.6-3.2H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H192.9A15.2,15.2,0,0,0,208,200.9V184h16.9A15.2,15.2,0,0,0,240,168.9V80A16,16,0,0,0,224,64Zm0,104H208V112a16,16,0,0,0-16-16H122.7L94.9,75.2A15.6,15.6,0,0,0,85.3,72H72V56h45.3l27.8,20.8a15.6,15.6,0,0,0,9.6,3.2H224Z" />
    </_Svg>
  )
}

Icon.displayName = 'FoldersFill'

export const FoldersFill = memo<IconProps>(themed(Icon))
