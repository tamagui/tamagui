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
      <_Path d="M225.9,114.9a15.8,15.8,0,0,0-13.4-3.1,23.9,23.9,0,0,1-29.3-23.1,16,16,0,0,0-15.9-15.9,23.9,23.9,0,0,1-23.1-29.3A16.1,16.1,0,0,0,128.6,24H128A104.1,104.1,0,0,0,24,128.7a104,104,0,0,0,208-1.3h0A15.7,15.7,0,0,0,225.9,114.9ZM75.5,99.5a12,12,0,1,1,0,17A12,12,0,0,1,75.5,99.5Zm25,73a12,12,0,1,1,0-17A12,12,0,0,1,100.5,172.5Zm27-40a12,12,0,1,1,17,0A12,12,0,0,1,127.5,132.5Zm37,48a12,12,0,1,1,0-17A12,12,0,0,1,164.5,180.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'CookieFill'

export const CookieFill = memo<IconProps>(themed(Icon))
