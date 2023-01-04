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
      <_Path d="M240,136v64a8,8,0,0,1-8,8H168a8.1,8.1,0,0,1-7.4-4.9,8.4,8.4,0,0,1,1.7-8.8L188.7,168,136,115.3l-34.3,34.4a8.1,8.1,0,0,1-11.4,0l-72-72A8.1,8.1,0,0,1,29.7,66.3L96,132.7l34.3-34.4a8.1,8.1,0,0,1,11.4,0L200,156.7l26.3-26.4a8.4,8.4,0,0,1,8.8-1.7A8,8,0,0,1,240,136Z" />
    </_Svg>
  )
}

Icon.displayName = 'TrendDownFill'

export const TrendDownFill = memo<IconProps>(themed(Icon))
