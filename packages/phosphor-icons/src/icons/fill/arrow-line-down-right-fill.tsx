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
      <_Path d="M200,100V200a8,8,0,0,1-8,8H92a8,8,0,0,1-7.4-4.9,8.4,8.4,0,0,1,1.7-8.8L130.7,150,74.3,93.7A8.1,8.1,0,0,1,85.7,82.3L142,138.7l44.3-44.4a8.4,8.4,0,0,1,8.8-1.7A8,8,0,0,1,200,100Zm16-68H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowLineDownRightFill'

export const ArrowLineDownRightFill = memo<IconProps>(themed(Icon))
