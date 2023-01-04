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
      <_Path d="M199.9,194.9a7.8,7.8,0,0,1,1.1,8.5,7.9,7.9,0,0,1-7.2,4.6H22.2a7.9,7.9,0,0,1-7.2-4.6,7.8,7.8,0,0,1,1.1-8.5,118.4,118.4,0,0,1,55.8-37.3,68,68,0,1,1,72.2,0A118.4,118.4,0,0,1,199.9,194.9ZM251.2,154a8,8,0,0,1-7,4,7.6,7.6,0,0,1-4-1.1l-4.6-2.7a24,24,0,0,1-7.6,4.4V164a8,8,0,0,1-16,0v-5.4a24,24,0,0,1-7.6-4.4l-4.6,2.7a7.6,7.6,0,0,1-4,1.1,8,8,0,0,1-4-14.9l4.6-2.7a24.4,24.4,0,0,1,0-8.8l-4.6-2.7a7.9,7.9,0,0,1-3-10.9,8.1,8.1,0,0,1,11-2.9l4.6,2.7a24,24,0,0,1,7.6-4.4V108a8,8,0,0,1,16,0v5.4a24,24,0,0,1,7.6,4.4l4.6-2.7a8.1,8.1,0,0,1,11,2.9,7.9,7.9,0,0,1-3,10.9l-4.6,2.7a24.4,24.4,0,0,1,0,8.8l4.6,2.7A7.9,7.9,0,0,1,251.2,154ZM220,144a8,8,0,1,0-8-8A8,8,0,0,0,220,144Z" />
    </_Svg>
  )
}

Icon.displayName = 'UserGearFill'

export const UserGearFill = memo<IconProps>(themed(Icon))
