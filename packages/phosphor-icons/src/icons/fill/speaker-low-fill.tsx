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
      <_Path d="M155.5,24.8a8,8,0,0,0-8.4.9L77.3,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.3l69.8,54.3A8.1,8.1,0,0,0,152,232a8.5,8.5,0,0,0,3.5-.8A8,8,0,0,0,160,224V32A8.1,8.1,0,0,0,155.5,24.8ZM32,96H72v64H32Z" />
      <_Path d="M196.3,99.7a8,8,0,0,0-11.3,0,7.9,7.9,0,0,0,0,11.3,24.1,24.1,0,0,1,0,34,7.9,7.9,0,0,0,0,11.3,7.6,7.6,0,0,0,5.6,2.3,7.8,7.8,0,0,0,5.7-2.3,40.1,40.1,0,0,0,0-56.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'SpeakerLowFill'

export const SpeakerLowFill = memo<IconProps>(themed(Icon))
