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
      <_Path d="M246,98.7l-56-64a8,8,0,0,0-6-2.7H72a8,8,0,0,0-6,2.7l-56,64a8.1,8.1,0,0,0,.2,10.8l112,120a8,8,0,0,0,11.6,0l112-120A8.1,8.1,0,0,0,246,98.7ZM222.4,96H181L144.2,48h36.2ZM73.5,112l30.6,74.6L34.4,112Zm109,0h39.1l-69.7,74.6ZM75.6,48h36.2L75,96H33.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'SketchLogoFill'

export const SketchLogoFill = memo<IconProps>(themed(Icon))
