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
      <_Path d="M232,184a8,8,0,0,1-8,8H161a16.2,16.2,0,0,1-14.4-8.8L95.1,80H32a8,8,0,0,1,0-16H95.1a16,16,0,0,1,14.3,8.8L161,176h63A8,8,0,0,1,232,184ZM152,80h72a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'OptionFill'

export const OptionFill = memo<IconProps>(themed(Icon))
