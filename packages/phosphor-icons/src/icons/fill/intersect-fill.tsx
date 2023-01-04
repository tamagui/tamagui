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
      <_Path d="M174.6,81.4a80,80,0,1,0-93.2,93.2,80,80,0,1,0,93.2-93.2ZM32,96A64,64,0,0,1,158,80.1,79.9,79.9,0,0,0,80.1,158,64.2,64.2,0,0,1,32,96ZM160,224a64.2,64.2,0,0,1-62-48.1A79.9,79.9,0,0,0,175.9,98,64,64,0,0,1,160,224Z" />
    </_Svg>
  )
}

Icon.displayName = 'IntersectFill'

export const IntersectFill = memo<IconProps>(themed(Icon))
