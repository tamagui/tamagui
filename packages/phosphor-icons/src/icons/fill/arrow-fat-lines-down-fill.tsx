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
      <_Path d="M229.7,141.7l-96,96a8.1,8.1,0,0,1-11.4,0l-96-96a8.4,8.4,0,0,1-1.7-8.8A8,8,0,0,1,32,128H72V104a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8v24h40a8,8,0,0,1,7.4,4.9A8.4,8.4,0,0,1,229.7,141.7ZM184,40a8,8,0,0,0-8-8H80a8,8,0,0,0,0,16h96A8,8,0,0,0,184,40Zm0,32a8,8,0,0,0-8-8H80a8,8,0,0,0,0,16h96A8,8,0,0,0,184,72Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowFatLinesDownFill'

export const ArrowFatLinesDownFill = memo<IconProps>(themed(Icon))
