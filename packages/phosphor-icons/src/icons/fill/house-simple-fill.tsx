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
      <_Path d="M218.8,103.7h0L138.8,31a16,16,0,0,0-21.6,0l-80,72.7A16,16,0,0,0,32,115.5V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.5A16,16,0,0,0,218.8,103.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'HouseSimpleFill'

export const HouseSimpleFill = memo<IconProps>(themed(Icon))
