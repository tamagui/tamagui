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
      <_Path d="M197.7,197.7a8.2,8.2,0,0,1-11.4,0L116,127.3,69.7,173.7A8.3,8.3,0,0,1,64,176a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,56,168V64a8,8,0,0,1,8-8H168a8,8,0,0,1,7.4,4.9,8.4,8.4,0,0,1-1.7,8.8L127.3,116l70.4,70.3A8.1,8.1,0,0,1,197.7,197.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowUpLeftFill'

export const ArrowUpLeftFill = memo<IconProps>(themed(Icon))
