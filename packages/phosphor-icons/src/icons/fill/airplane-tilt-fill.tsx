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
      <_Path d="M215,86.2l-29.8,28,30.2,83.1a8,8,0,0,1-1.9,8.4l-24,24a8.2,8.2,0,0,1-6.4,2.3,8.1,8.1,0,0,1-5.8-3.5l-42.6-62.3-18.8,17.3V204a8.2,8.2,0,0,1-2.4,5.7l-20,20a7.9,7.9,0,0,1-5.6,2.3l-1.8-.2a8,8,0,0,1-5.8-5.2L67.4,188.5,29.3,175.6a8,8,0,0,1-5.2-5.8,8.3,8.3,0,0,1,2.1-7.5l20-20a8.1,8.1,0,0,1,5.7-2.3H72.6l18.7-18.8L27.4,78.7a8.7,8.7,0,0,1-3.5-5.9,8.2,8.2,0,0,1,2.3-6.5l24-24a7.9,7.9,0,0,1,8.4-1.8l83.1,30.2,26.6-28.2a5.2,5.2,0,0,1,1-1.1,32,32,0,0,1,47,43.3A6.4,6.4,0,0,1,215,86.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'AirplaneTiltFill'

export const AirplaneTiltFill = memo<IconProps>(themed(Icon))
