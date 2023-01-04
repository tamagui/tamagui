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
      <_Path d="M173.8,51.5a221.5,221.5,0,0,0-41.7-34.4,8,8,0,0,0-8.2,0A221.5,221.5,0,0,0,82.2,51.5C54.6,80.5,40,112.5,40,144a88,88,0,0,0,176,0C216,112.5,201.4,80.5,173.8,51.5ZM96,184c0-27.7,22.5-47.3,32-54.3,9.5,7,32,26.6,32,54.3a32,32,0,0,1-64,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'FlameFill'

export const FlameFill = memo<IconProps>(themed(Icon))
