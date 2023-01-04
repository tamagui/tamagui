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
      <_Path d="M235.5,54.5l-34-34a8,8,0,1,0-11.3,11.3l34,34a8,8,0,0,0,5.6,2.3,8.3,8.3,0,0,0,5.7-2.3A8,8,0,0,0,235.5,54.5Z" />
      <_Path d="M65.8,20.5a8,8,0,0,0-11.3,0l-34,34a8,8,0,0,0,0,11.3,8.3,8.3,0,0,0,5.7,2.3,8,8,0,0,0,5.6-2.3l34-34A8,8,0,0,0,65.8,20.5Z" />
      <_Path d="M224,125.2a14.8,14.8,0,0,1-.1-2.1h0A96,96,0,0,0,133,32.1H123A96,96,0,0,0,32.1,123h0a14.8,14.8,0,0,1-.1,2.1v5.6a14.8,14.8,0,0,1,.1,2.1h0A96,96,0,0,0,123,223.9h10A96,96,0,0,0,223.9,133h0a14.8,14.8,0,0,1,.1-2.1v-5.6ZM184,136H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'AlarmFill'

export const AlarmFill = memo<IconProps>(themed(Icon))
