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
      <_Path d="M200,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V40A16,16,0,0,0,200,24ZM96,48h64a8,8,0,0,1,0,16H96a8,8,0,0,1,0-16Zm84.8,150.4a8.1,8.1,0,0,1-11.2-1.6,52,52,0,0,0-83.2,0A8,8,0,0,1,80,200a7.7,7.7,0,0,1-4.8-1.6,8,8,0,0,1-1.6-11.2A67.8,67.8,0,0,1,101,165.5a40,40,0,1,1,54,0,67.8,67.8,0,0,1,27.4,21.7A8,8,0,0,1,180.8,198.4ZM152,136a24,24,0,1,1-24-24A24.1,24.1,0,0,1,152,136Z" />
    </_Svg>
  )
}

Icon.displayName = 'IdentificationBadgeFill'

export const IdentificationBadgeFill = memo<IconProps>(themed(Icon))
