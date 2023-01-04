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
      <_Path d="M229.9,226.6a7.9,7.9,0,0,1-.5,11.3A8.2,8.2,0,0,1,224,240a8,8,0,0,1-5.9-2.6l-42.4-46.6A15.9,15.9,0,0,1,160,204H24A16,16,0,0,1,8,188V68A16,16,0,0,1,24,52H49.6L29,29.4a8,8,0,0,1,.5-11.3,7.9,7.9,0,0,1,11.3.5ZM245.5,74.2a7.9,7.9,0,0,0-9.5-1.1L196,95.9a8,8,0,0,0-4,7v50.2a8,8,0,0,0,4,7l40,22.8a8.3,8.3,0,0,0,4,1.1,7.9,7.9,0,0,0,5.8-2.5,8,8,0,0,0,2.2-5.7V80.2A8,8,0,0,0,245.5,74.2Zm-83.4,54a8,8,0,0,0,9.8,1.6,8.2,8.2,0,0,0,4.1-7.3V68a16,16,0,0,0-16-16H111.1a8.5,8.5,0,0,0-6.6,3.1,8,8,0,0,0,.5,10.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'VideoCameraSlashFill'

export const VideoCameraSlashFill = memo<IconProps>(themed(Icon))
