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
      <_Path d="M120,80V184a8,8,0,0,1-8,8H96v16h16a8,8,0,0,1,0,16H64a8,8,0,0,1,0-16H80V192H32A24.1,24.1,0,0,1,8,168V96A24.1,24.1,0,0,1,32,72h80A8,8,0,0,1,120,80ZM248,48V208a16,16,0,0,1-16,16H152a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h80A16,16,0,0,1,248,48ZM204,180a12,12,0,1,0-12,12A12,12,0,0,0,204,180Zm20-76a8,8,0,0,0-8-8H168a8,8,0,0,0,0,16h48A8,8,0,0,0,224,104Zm0-32a8,8,0,0,0-8-8H168a8,8,0,0,0,0,16h48A8,8,0,0,0,224,72Z" />
    </_Svg>
  )
}

Icon.displayName = 'DesktopTowerFill'

export const DesktopTowerFill = memo<IconProps>(themed(Icon))
