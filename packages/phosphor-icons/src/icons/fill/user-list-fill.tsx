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
      <_Path d="M144,80a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H152A8,8,0,0,1,144,80Zm104,40H152a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Zm0,48H176a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16ZM109.1,142.1a48,48,0,1,0-58.2,0A72,72,0,0,0,10.3,190a8.1,8.1,0,0,0,1.4,6.9A7.8,7.8,0,0,0,18,200H142a7.8,7.8,0,0,0,6.3-3.1,8.1,8.1,0,0,0,1.4-6.9A72,72,0,0,0,109.1,142.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'UserListFill'

export const UserListFill = memo<IconProps>(themed(Icon))
