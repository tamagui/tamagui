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
      <_Path d="M208,40a8,8,0,0,1-8,8H170.7a24,24,0,0,0-23.6,19.7L137.6,120H184a8,8,0,0,1,0,16H134.7l-10.1,55.2A39.9,39.9,0,0,1,85.3,224H56a8,8,0,0,1,0-16H85.3a24,24,0,0,0,23.6-19.7l9.5-52.3H72a8,8,0,0,1,0-16h49.3l10.1-55.2A39.9,39.9,0,0,1,170.7,32H200A8,8,0,0,1,208,40Z" />
    </_Svg>
  )
}

Icon.displayName = 'FunctionFill'

export const FunctionFill = memo<IconProps>(themed(Icon))
