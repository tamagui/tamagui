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
      <_Path d="M136,92h92a4,4,0,0,0,4-4V56a8,8,0,0,0-8-8H140a4,4,0,0,0-4,4Z" />
      <_Path d="M184,152h44a4,4,0,0,0,4-4V112a4,4,0,0,0-4-4H184Z" />
      <_Rect x="88" y="108" width="80" height="44" />
      <_Path d="M72,108H28a4,4,0,0,0-4,4v36a4,4,0,0,0,4,4H72Z" />
      <_Path d="M136,168v36a4,4,0,0,0,4,4h84a8,8,0,0,0,8-8V172a4,4,0,0,0-4-4Z" />
      <_Path d="M120,92V52a4,4,0,0,0-4-4H32a8,8,0,0,0-8,8V88a4,4,0,0,0,4,4Z" />
      <_Path d="M120,168H28a4,4,0,0,0-4,4v28a8,8,0,0,0,8,8h84a4,4,0,0,0,4-4Z" />
    </_Svg>
  )
}

Icon.displayName = 'WallFill'

export const WallFill = memo<IconProps>(themed(Icon))
