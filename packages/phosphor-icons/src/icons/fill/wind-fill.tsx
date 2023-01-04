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
      <_Path d="M184,184a32,32,0,0,1-62,11.1,8,8,0,1,1,15-5.5A16,16,0,1,0,152,168H40a8,8,0,0,1,0-16H152A32.1,32.1,0,0,1,184,184Zm-64-80A32,32,0,1,0,90,60.9a8,8,0,1,0,15,5.5A16,16,0,1,1,120,88H24a8,8,0,0,0,0,16Zm88-32a32.1,32.1,0,0,0-30,20.9,8,8,0,1,0,15,5.5A16,16,0,1,1,208,120H32a8,8,0,0,0,0,16H208a32,32,0,0,0,0-64Z" />
    </_Svg>
  )
}

Icon.displayName = 'WindFill'

export const WindFill = memo<IconProps>(themed(Icon))
