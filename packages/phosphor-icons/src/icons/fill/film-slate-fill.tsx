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
      <_Path d="M216,104H100.8L212.1,74.2a7.9,7.9,0,0,0,4.8-3.8,7.5,7.5,0,0,0,.8-6l-8.3-30.9a15.8,15.8,0,0,0-19.5-11.3L35.3,63.6A15.9,15.9,0,0,0,24,83.2l8,29.9V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V112A8,8,0,0,0,216,104ZM169.3,69.1,99.7,87.7l-29.3-17,69.5-18.6ZM208,200H48V120H208v80Z" />
    </_Svg>
  )
}

Icon.displayName = 'FilmSlateFill'

export const FilmSlateFill = memo<IconProps>(themed(Icon))
