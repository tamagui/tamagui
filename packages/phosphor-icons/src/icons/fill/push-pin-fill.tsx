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
      <_Path d="M232,107.3l-58.5,58.5c4.5,12.7,6.4,33.9-13.2,60a16.3,16.3,0,0,1-11.7,6.4h-1.1a16.1,16.1,0,0,1-11.3-4.7L88,179.3,53.7,213.7a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L76.7,168,28.3,119.6a15.9,15.9,0,0,1,1.3-23.8C55,75.3,79.3,79.4,90,82.7L148.7,24h0a16.1,16.1,0,0,1,22.6,0L232,84.7a15.9,15.9,0,0,1,0,22.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'PushPinFill'

export const PushPinFill = memo<IconProps>(themed(Icon))
