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
      <_Path d="M208,100V32a8,8,0,0,0-8-8H56a8,8,0,0,0-5.5,13.8L107.9,92H56a8,8,0,0,0-8,8v68a7.9,7.9,0,0,0,2.5,5.8l72,68A8.2,8.2,0,0,0,128,244a7.4,7.4,0,0,0,3.2-.7A7.9,7.9,0,0,0,136,236V176h64a8,8,0,0,0,5.5-13.8L148.1,108H200A8,8,0,0,0,208,100Z" />
    </_Svg>
  )
}

Icon.displayName = 'FramerLogoFill'

export const FramerLogoFill = memo<IconProps>(themed(Icon))
