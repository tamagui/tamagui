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
      <_Path d="M228.5,49.5A15.9,15.9,0,0,0,213.9,40H42.1A16.1,16.1,0,0,0,30.2,66.8L96,139.1v78a15.9,15.9,0,0,0,8.5,14.1,16.4,16.4,0,0,0,7.5,1.9,16,16,0,0,0,8.9-2.7l32-21.4a15.9,15.9,0,0,0,7.1-13.3V139.1l65.8-72.3A15.9,15.9,0,0,0,228.5,49.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'FunnelFill'

export const FunnelFill = memo<IconProps>(themed(Icon))
