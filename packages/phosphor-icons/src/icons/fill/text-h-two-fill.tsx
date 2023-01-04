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
      <_Path d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0Zm88,136H208l34.3-45.8.2-.3A31.8,31.8,0,0,0,248,128a32,32,0,0,0-61.5-12.5,8,8,0,0,0,14.8,6.3A15.9,15.9,0,0,1,216,112a16,16,0,0,1,13.4,24.8l-43.7,58.3A7.5,7.5,0,0,0,184,200a8,8,0,0,0,5.5,7.6,7.3,7.3,0,0,0,2.5.4h48a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'TextHTwoFill'

export const TextHTwoFill = memo<IconProps>(themed(Icon))
