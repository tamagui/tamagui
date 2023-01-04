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
      <_Path d="M232,208H213.7L153.4,34.7A16,16,0,0,0,138.3,24H117.7a16,16,0,0,0-15.1,10.7L42.3,208H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16ZM95.4,104h65.2l16.7,48H78.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'TrafficConeFill'

export const TrafficConeFill = memo<IconProps>(themed(Icon))
