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
      <_Path d="M235,69.3A15.9,15.9,0,0,0,223.1,64H175.3a48,48,0,0,0-94.6,0H32.9A15.9,15.9,0,0,0,21,69.3a16.2,16.2,0,0,0-4,12.5l14.3,128A15.9,15.9,0,0,0,47.2,224H208.8a15.9,15.9,0,0,0,15.9-14.2L239,81.8A16.2,16.2,0,0,0,235,69.3ZM96,104a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm1-40a32,32,0,0,1,62,0Zm79,40a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'ToteFill'

export const ToteFill = memo<IconProps>(themed(Icon))
