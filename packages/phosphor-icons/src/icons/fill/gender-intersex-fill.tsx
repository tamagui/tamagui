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
      <_Path d="M208,16H168a8,8,0,0,0,0,16h20.7L164.3,56.4A68,68,0,1,0,112,175.5V196H88a8,8,0,0,0,0,16h24v20a8,8,0,0,0,16,0V212h24a8,8,0,0,0,0-16H128V175.5A67.9,67.9,0,0,0,175.1,68.2L200,43.3V64a8,8,0,0,0,16,0V24A8,8,0,0,0,208,16ZM120,160a52,52,0,1,1,52-52A52,52,0,0,1,120,160Z" />
    </_Svg>
  )
}

Icon.displayName = 'GenderIntersexFill'

export const GenderIntersexFill = memo<IconProps>(themed(Icon))
