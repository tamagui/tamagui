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
      <_Path d="M94,58.7A8,8,0,0,0,82.7,58l-72,64a8,8,0,0,0,0,12l72,64a8.1,8.1,0,0,0,5.3,2,8,8,0,0,0,5.3-14L28,128,93.3,70A8,8,0,0,0,94,58.7Z" />
      <_Path d="M245.3,122l-72-64a8,8,0,0,0-10.6,12L228,128l-65.3,58a8,8,0,0,0,5.3,14,8.1,8.1,0,0,0,5.3-2l72-64a8,8,0,0,0,0-12Z" />
    </_Svg>
  )
}

Icon.displayName = 'CodeSimpleFill'

export const CodeSimpleFill = memo<IconProps>(themed(Icon))
