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
      <_Path d="M168,76a12,12,0,1,1-12-12A12,12,0,0,1,168,76Zm37.7,83.5c-20.4,25.9-53.2,40.1-97.5,42.1L87.4,251.1A8.1,8.1,0,0,1,80,256h-.5a7.9,7.9,0,0,1-7.2-5.8L57.5,198.5,5.8,183.7a8,8,0,0,1-.9-15.1l49.5-20.8c2-44.3,16.1-77.1,42.1-97.5,41.1-32.4,99.4-23,116.3-19.3A15.9,15.9,0,0,1,225,43.2C228.7,60.1,238.1,118.4,205.7,159.5Zm3.7-112.9c-15.2-3.2-67.4-11.8-103,16.3A74.1,74.1,0,0,0,96,72.7,40.1,40.1,0,0,0,136,112a8,8,0,0,1,8,8,40.1,40.1,0,0,0,39.3,40,80,80,0,0,0,9.8-10.4C221.2,114,212.6,61.8,209.4,46.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'FishFill'

export const FishFill = memo<IconProps>(themed(Icon))
