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
      <_Path d="M237.7,178.3a8.1,8.1,0,0,1,0,11.4l-24,24A8.3,8.3,0,0,1,208,216a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,200,208V192H172.1a16.1,16.1,0,0,1-13-6.7L83.9,80H32a8,8,0,0,1,0-16H83.9a16.1,16.1,0,0,1,13,6.7L172.1,176H200V160a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7ZM143,107a8,8,0,0,0,11.2-1.9L172.1,80H200V96a8,8,0,0,0,4.9,7.4,8.5,8.5,0,0,0,3.1.6,8.3,8.3,0,0,0,5.7-2.3l24-24a8.1,8.1,0,0,0,0-11.4l-24-24a8.4,8.4,0,0,0-8.8-1.7A8,8,0,0,0,200,48V64H172.1a16.1,16.1,0,0,0-13,6.7L141.2,95.8A8,8,0,0,0,143,107Zm-30,42a8,8,0,0,0-11.2,1.9L83.9,176H32a8,8,0,0,0,0,16H83.9a16.1,16.1,0,0,0,13-6.7l17.9-25.1A8,8,0,0,0,113,149Z" />
    </_Svg>
  )
}

Icon.displayName = 'ShuffleAngularFill'

export const ShuffleAngularFill = memo<IconProps>(themed(Icon))
