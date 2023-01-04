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
      <_Path d="M184,224a8,8,0,0,1-8,8H80a7.3,7.3,0,0,1-2.5-.4A8,8,0,0,1,72,224a8,8,0,0,1,1.7-5l87.6-116.8A40,40,0,1,0,91.1,64.4a8,8,0,1,1-14.7-6.2,56,56,0,1,1,98,53.1c0,.1-.1.2-.2.3L96,216h80A8,8,0,0,1,184,224Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberTwoFill'

export const NumberTwoFill = memo<IconProps>(themed(Icon))
