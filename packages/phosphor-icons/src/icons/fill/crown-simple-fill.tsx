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
      <_Path d="M238.7,73.5A15.9,15.9,0,0,0,222,71.2L171.4,93.7,142,40.7a16.1,16.1,0,0,0-28,0l-29.4,53L34,71.2A16,16,0,0,0,11.9,89.5L37.3,197.8a15.9,15.9,0,0,0,7.4,10.1,16.2,16.2,0,0,0,8.3,2.3,15.2,15.2,0,0,0,4.2-.6,265.5,265.5,0,0,1,141.5,0,16.5,16.5,0,0,0,12.5-1.7,15.6,15.6,0,0,0,7.4-10.1L244.1,89.5A16,16,0,0,0,238.7,73.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'CrownSimpleFill'

export const CrownSimpleFill = memo<IconProps>(themed(Icon))
