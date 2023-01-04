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
      <_Path d="M236,120H223.7A96.2,96.2,0,0,0,136,32.3V20a8,8,0,0,0-16,0V32.3A96.2,96.2,0,0,0,32.3,120H20a8,8,0,0,0,0,16H32.3A96.2,96.2,0,0,0,120,223.7V236a8,8,0,0,0,16,0V223.7A96.2,96.2,0,0,0,223.7,136H236a8,8,0,0,0,0-16Zm-40,16h11.6A80.3,80.3,0,0,1,136,207.6V196a8,8,0,0,0-16,0v11.6A80.3,80.3,0,0,1,48.4,136H60a8,8,0,0,0,0-16H48.4A80.3,80.3,0,0,1,120,48.4V60a8,8,0,0,0,16,0V48.4A80.3,80.3,0,0,1,207.6,120H196a8,8,0,0,0,0,16Z" />
      <_Circle cx="128" cy="128" r="40" />
    </_Svg>
  )
}

Icon.displayName = 'CrosshairFill'

export const CrosshairFill = memo<IconProps>(themed(Icon))
