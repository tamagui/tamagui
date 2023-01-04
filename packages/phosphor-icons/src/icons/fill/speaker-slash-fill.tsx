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
      <_Path d="M53.9,34.6A8,8,0,0,0,42.1,45.4L73.6,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H77.3l69.8,54.3h0A7.9,7.9,0,0,0,152,232a8.5,8.5,0,0,0,3.5-.8A8,8,0,0,0,160,224V175.1l42.1,46.3A8,8,0,0,0,208,224a8.2,8.2,0,0,0,5.4-2.1,7.9,7.9,0,0,0,.5-11.3ZM72,160H32V96H72Z" />
      <_Path d="M146.1,112.2a7.9,7.9,0,0,0,5.9,2.6,7.4,7.4,0,0,0,2.9-.5,8,8,0,0,0,5.1-7.5V32a8,8,0,0,0-12.9-6.3l-39.9,31a8.2,8.2,0,0,0-3,5.6,8.1,8.1,0,0,0,2,6.1Z" />
      <_Path d="M224.5,71.4a8,8,0,0,0-11.3,0,8.1,8.1,0,0,0,0,11.4,63.9,63.9,0,0,1,0,90.5,8,8,0,0,0,0,11.3,8.3,8.3,0,0,0,5.7,2.3,8,8,0,0,0,5.6-2.3,79.9,79.9,0,0,0,0-113.2Z" />
      <_Path d="M192,128a23.8,23.8,0,0,1-7.1,17,8,8,0,0,0,5.7,13.6,7.8,7.8,0,0,0,5.7-2.3,40.1,40.1,0,0,0,0-56.6,8.1,8.1,0,0,0-11.4,0,8,8,0,0,0,0,11.3A23.8,23.8,0,0,1,192,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'SpeakerSlashFill'

export const SpeakerSlashFill = memo<IconProps>(themed(Icon))
