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
      <_Ellipse cx="128" cy="128" rx="24" ry="40" />
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm0,160c-27.6,0-40-28.1-40-56s12.4-56,40-56,40,28.1,40,56S155.6,184,128,184Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberCircleZeroFill'

export const NumberCircleZeroFill = memo<IconProps>(themed(Icon))
