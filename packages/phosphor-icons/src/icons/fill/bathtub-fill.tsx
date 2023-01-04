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
      <_Path d="M232,96H212a8,8,0,0,0-8-8H132a8,8,0,0,0-8,8H64V52a12,12,0,0,1,24,0,8,8,0,0,0,16,0,28,28,0,0,0-56,0V96H24A16,16,0,0,0,8,112v32a56,56,0,0,0,56,56v16a8,8,0,0,0,16,0V200h96v16a8,8,0,0,0,16,0V200a56,56,0,0,0,56-56V112A16,16,0,0,0,232,96Zm-36,8v36H140V104Z" />
    </_Svg>
  )
}

Icon.displayName = 'BathtubFill'

export const BathtubFill = memo<IconProps>(themed(Icon))
