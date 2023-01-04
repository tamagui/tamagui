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
      <_Path d="M235.9,84.1v64a8,8,0,0,1-8,8h-64a7.9,7.9,0,0,1-7.4-4.9,8,8,0,0,1,1.7-8.7l26.1-26.1A88,88,0,0,0,40,184a8,8,0,0,1-16,0A104.1,104.1,0,0,1,128,80a103.3,103.3,0,0,1,67.7,25l26.5-26.5a8,8,0,0,1,13.7,5.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowArcRightFill'

export const ArrowArcRightFill = memo<IconProps>(themed(Icon))
