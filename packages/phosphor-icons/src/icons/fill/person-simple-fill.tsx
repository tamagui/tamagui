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
      <_Path d="M95.9,48a32,32,0,1,1,32,32A32,32,0,0,1,95.9,48Zm132.2,73.1C226.4,120.1,185.6,96,128,96S29.6,120.1,27.9,121.1a8,8,0,0,0,8.2,13.8c.4-.3,34.9-20.6,83.9-22.7V149L58,218.7a8,8,0,0,0,12,10.6L128,164l58,65.3a8,8,0,0,0,6,2.7,8.1,8.1,0,0,0,5.3-2,8,8,0,0,0,.7-11.3L136,149V112.2c48.8,2.1,83.5,22.4,83.9,22.7A8.7,8.7,0,0,0,224,136a8,8,0,0,0,4.1-14.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'PersonSimpleFill'

export const PersonSimpleFill = memo<IconProps>(themed(Icon))
