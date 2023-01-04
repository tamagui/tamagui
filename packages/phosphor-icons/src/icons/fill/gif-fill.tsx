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
      <_Path d="M136,64a8,8,0,0,0-8,8V184a8,8,0,0,0,16,0V72A8,8,0,0,0,136,64Z" />
      <_Path d="M228,64H180a8,8,0,0,0-8,8V184a8,8,0,0,0,16,0V136h28a8,8,0,0,0,0-16H188V80h40a8,8,0,0,0,0-16Z" />
      <_Path d="M96,120H72a8,8,0,0,0,0,16H88v16a24,24,0,0,1-48,0V104a24,24,0,0,1,47.2-6,8,8,0,0,0,15.5-4A40,40,0,0,0,24,104v48a40,40,0,0,0,80,0V128A8,8,0,0,0,96,120Z" />
    </_Svg>
  )
}

Icon.displayName = 'GifFill'

export const GifFill = memo<IconProps>(themed(Icon))
