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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm52.3,62.1-28,62.2a8.2,8.2,0,0,1-4.2,4L88.7,177.8a8.5,8.5,0,0,1-3.1.6,8.1,8.1,0,0,1-5.7-2.3,8,8,0,0,1-1.7-8.8l25.5-59.4a8.2,8.2,0,0,1,4-4.2l62-28.2a8.1,8.1,0,0,1,9,1.7A7.8,7.8,0,0,1,180.3,86.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'CompassFill'

export const CompassFill = memo<IconProps>(themed(Icon))
