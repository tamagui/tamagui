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
      <_Path d="M209.7,110l-26-88.3A8,8,0,0,0,176,16H80a8,8,0,0,0-7.7,5.7L46.3,110a31.5,31.5,0,0,0,1.5,22.2A88.1,88.1,0,0,0,120,183.6V224H88a8,8,0,0,0,0,16h80a8,8,0,0,0,0-16H136V183.6a88.1,88.1,0,0,0,72.2-51.4A31.5,31.5,0,0,0,209.7,110ZM131.6,96.8c-26.2-13-47.2-13-61.9-9.5L86,32h84l20.8,70.5C180.1,107,159.8,110.9,131.6,96.8Z" />
    </_Svg>
  )
}

Icon.displayName = 'WineFill'

export const WineFill = memo<IconProps>(themed(Icon))
