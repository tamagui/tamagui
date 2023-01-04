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
      <_Path d="M240,208H224V136h0v-.5a.8.8,0,0,0-.1-.4h0l-15-105.2A16,16,0,0,0,193.1,16H174.9a16,16,0,0,0-15.8,13.7l-11.6,81L108.8,81.6A8,8,0,0,0,96,88v32L44.8,81.6A8,8,0,0,0,32,88V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM100,184H72a8,8,0,0,1,0-16h28a8,8,0,0,1,0,16Zm84,0H156a8,8,0,0,1,0-16h28a8,8,0,0,1,0,16Zm-13.3-56-8.6-6.4L174.9,32h18.2l13.7,96Z" />
    </_Svg>
  )
}

Icon.displayName = 'FactoryFill'

export const FactoryFill = memo<IconProps>(themed(Icon))
