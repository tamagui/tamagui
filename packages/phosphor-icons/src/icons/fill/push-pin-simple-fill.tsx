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
      <_Path d="M224,176a8,8,0,0,1-8,8H136v56a8,8,0,0,1-16,0V184H40a8,8,0,0,1,0-16h9.3L70.5,48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16h-6.5l21.2,120H216A8,8,0,0,1,224,176Z" />
    </_Svg>
  )
}

Icon.displayName = 'PushPinSimpleFill'

export const PushPinSimpleFill = memo<IconProps>(themed(Icon))
