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
      <_Path d="M200,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V40A16,16,0,0,0,200,24ZM88,200a12,12,0,1,1,12-12A12,12,0,0,1,88,200Zm0-40a12,12,0,1,1,12-12A12,12,0,0,1,88,160Zm40,40a12,12,0,1,1,12-12A12,12,0,0,1,128,200Zm0-40a12,12,0,1,1,12-12A12,12,0,0,1,128,160Zm40,40a12,12,0,1,1,12-12A12,12,0,0,1,168,200Zm0-40a12,12,0,1,1,12-12A12,12,0,0,1,168,160Zm16-56a8,8,0,0,1-8,8H80a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8h96a8,8,0,0,1,8,8Z" />
    </_Svg>
  )
}

Icon.displayName = 'CalculatorFill'

export const CalculatorFill = memo<IconProps>(themed(Icon))
