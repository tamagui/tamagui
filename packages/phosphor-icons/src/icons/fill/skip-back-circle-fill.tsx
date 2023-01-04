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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm36,136a8,8,0,0,1-4.2,7.1,8.5,8.5,0,0,1-3.8.9,8.7,8.7,0,0,1-4.4-1.3L108,137.6V160a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0v22.4l43.6-29.1a8.3,8.3,0,0,1,8.2-.4A8,8,0,0,1,164,96Z" />
    </_Svg>
  )
}

Icon.displayName = 'SkipBackCircleFill'

export const SkipBackCircleFill = memo<IconProps>(themed(Icon))
