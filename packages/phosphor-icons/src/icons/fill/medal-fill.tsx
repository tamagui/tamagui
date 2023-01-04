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
      <_Circle cx="128" cy="96" r="56" />
      <_Path d="M128,8A87.9,87.9,0,0,0,72,163.8V240a7.9,7.9,0,0,0,3.8,6.8,8,8,0,0,0,7.8.4L128,224.9l44.4,22.3a9.4,9.4,0,0,0,3.6.8,8,8,0,0,0,8-8V163.8A87.9,87.9,0,0,0,128,8Zm0,160a72,72,0,1,1,72-72A72.1,72.1,0,0,1,128,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'MedalFill'

export const MedalFill = memo<IconProps>(themed(Icon))
