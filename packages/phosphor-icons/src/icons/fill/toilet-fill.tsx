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
      <_Path d="M224,112.1a8,8,0,0,0-8-8.1H40a8,8,0,0,0-8,8.1,96,96,0,0,0,52.8,85.6l-3.4,23.7a16.2,16.2,0,0,0,1.7,10.1A16,16,0,0,0,97.2,240h61.2a16.9,16.9,0,0,0,9.8-3,16.2,16.2,0,0,0,6.4-15.3l-3.4-24A96,96,0,0,0,224,112.1ZM97.2,224l2.9-20.1a97,97,0,0,0,55.8,0l2.9,20.1ZM60,88H196a4,4,0,0,0,4-4V40a16,16,0,0,0-16-16H72A16,16,0,0,0,56,40V84A4,4,0,0,0,60,88ZM88,48h15.7a8.2,8.2,0,0,1,8.3,7.5,8,8,0,0,1-8,8.5H88.3A8.2,8.2,0,0,1,80,56.5,8,8,0,0,1,88,48Z" />
    </_Svg>
  )
}

Icon.displayName = 'ToiletFill'

export const ToiletFill = memo<IconProps>(themed(Icon))
