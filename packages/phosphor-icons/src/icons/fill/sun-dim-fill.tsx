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
      <_Circle cx="128" cy="128" r="68" />
      <_Path d="M128,44a8,8,0,0,0,8-8V28a8,8,0,0,0-16,0v8A8,8,0,0,0,128,44Z" />
      <_Path d="M57.3,68.6a8.1,8.1,0,0,0,11.3,0,8,8,0,0,0,0-11.3l-5.7-5.7A8,8,0,0,0,51.6,62.9Z" />
      <_Path d="M36,120H28a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z" />
      <_Path d="M57.3,187.4l-5.7,5.7a8,8,0,0,0,0,11.3,8.3,8.3,0,0,0,5.7,2.3,8,8,0,0,0,5.6-2.3l5.7-5.7a8,8,0,0,0-11.3-11.3Z" />
      <_Path d="M128,212a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,212Z" />
      <_Path d="M198.7,187.4a8,8,0,0,0-11.3,11.3l5.7,5.7a8,8,0,0,0,5.6,2.3,8.3,8.3,0,0,0,5.7-2.3,8,8,0,0,0,0-11.3Z" />
      <_Path d="M228,120h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z" />
      <_Path d="M193.1,70.9a7.8,7.8,0,0,0,5.6-2.3l5.7-5.7a8,8,0,1,0-11.3-11.3l-5.7,5.7a8,8,0,0,0,0,11.3A7.8,7.8,0,0,0,193.1,70.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'SunDimFill'

export const SunDimFill = memo<IconProps>(themed(Icon))
