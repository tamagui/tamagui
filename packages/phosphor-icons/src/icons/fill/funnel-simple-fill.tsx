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
      <_Path d="M192,120H64a8,8,0,0,0,0,16H192a8,8,0,0,0,0-16Z" />
      <_Path d="M232,72H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16Z" />
      <_Path d="M152,168H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'FunnelSimpleFill'

export const FunnelSimpleFill = memo<IconProps>(themed(Icon))
