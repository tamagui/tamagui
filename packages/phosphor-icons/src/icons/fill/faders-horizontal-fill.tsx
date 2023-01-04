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
      <_Path d="M136,164H40a8,8,0,0,0,0,16h96a8,8,0,0,0,0-16Z" />
      <_Path d="M216,164H176V148a8,8,0,0,0-16,0v48a8,8,0,0,0,16,0V180h40a8,8,0,0,0,0-16Z" />
      <_Path d="M40,92H72a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Z" />
      <_Path d="M104,116a8,8,0,0,0,8-8V92H216a8,8,0,0,0,0-16H112V60a8,8,0,0,0-16,0v48A8,8,0,0,0,104,116Z" />
    </_Svg>
  )
}

Icon.displayName = 'FadersHorizontalFill'

export const FadersHorizontalFill = memo<IconProps>(themed(Icon))
