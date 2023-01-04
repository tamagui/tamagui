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
      <_Path d="M229.7,173.7l-40,40a8.2,8.2,0,0,1-11.4,0l-40-40a8.4,8.4,0,0,1-1.7-8.8A8,8,0,0,1,144,160h32V112a8,8,0,0,1,16,0v48h32a8,8,0,0,1,7.4,4.9A8.4,8.4,0,0,1,229.7,173.7ZM120,120H48a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16ZM48,72H184a8,8,0,0,0,0-16H48a8,8,0,0,0,0,16Zm56,112H48a8,8,0,0,0,0,16h56a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'SortAscendingFill'

export const SortAscendingFill = memo<IconProps>(themed(Icon))
