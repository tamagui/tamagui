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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm28.6,144.7a8,8,0,0,1-10.7,3.5A39.6,39.6,0,0,0,128,168a39.1,39.1,0,0,0-18,4.3,8.6,8.6,0,0,1-3.6.8,8,8,0,0,1-3.6-15.1,55.3,55.3,0,0,1,25.2-6,56.1,56.1,0,0,1,25.1,5.9A8.1,8.1,0,0,1,156.6,168.7Zm14.8-28.3a7.9,7.9,0,0,1-10.7,3.4,72,72,0,0,0-65.4.1,8.4,8.4,0,0,1-3.7.9,7.9,7.9,0,0,1-7.1-4.4A8,8,0,0,1,88,129.6a87.9,87.9,0,0,1,79.9,0A8,8,0,0,1,171.4,140.4ZM186.2,112a7.9,7.9,0,0,1-10.7,3.4A104.3,104.3,0,0,0,128,104a103.2,103.2,0,0,0-47.6,11.5,7.7,7.7,0,0,1-3.6.9,8,8,0,0,1-3.7-15.1,120.2,120.2,0,0,1,109.7-.1A8,8,0,0,1,186.2,112Z" />
    </_Svg>
  )
}

Icon.displayName = 'SpotifyLogoFill'

export const SpotifyLogoFill = memo<IconProps>(themed(Icon))
