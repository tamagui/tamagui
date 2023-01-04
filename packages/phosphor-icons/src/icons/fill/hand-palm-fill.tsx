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
      <_Path d="M188,84a28.2,28.2,0,0,0-12,2.7V52a28.1,28.1,0,0,0-28-28,27.8,27.8,0,0,0-13.4,3.4A28,28,0,0,0,80,36v6.7A28,28,0,0,0,40,68v84a88,88,0,0,0,176,0V112A28.1,28.1,0,0,0,188,84Zm12,68a72,72,0,0,1-144,0V68a12,12,0,0,1,24,0v44a8,8,0,0,0,16,0V36a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V52a12,12,0,0,1,24,0v72.7A48,48,0,0,0,120,172a8,8,0,0,0,16,0,32.1,32.1,0,0,1,32-32,8,8,0,0,0,8-8V112a12,12,0,0,1,24,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'HandPalmFill'

export const HandPalmFill = memo<IconProps>(themed(Icon))
