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
      <_Path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V156.7l50.3-50.4a8.1,8.1,0,0,1,11.4,0L128,132.7,176.7,84,162.3,69.7a8.4,8.4,0,0,1-1.7-8.8A8.1,8.1,0,0,1,168,56h40a8,8,0,0,1,8,8v40a8,8,0,0,1-4.9,7.4,8.5,8.5,0,0,1-3.1.6,8.3,8.3,0,0,1-5.7-2.3L188,95.3l-54.3,54.4a8.1,8.1,0,0,1-11.4,0L96,123.3l-56,56V200H224A8,8,0,0,1,232,208Z" />
    </_Svg>
  )
}

Icon.displayName = 'ChartLineUpFill'

export const ChartLineUpFill = memo<IconProps>(themed(Icon))
