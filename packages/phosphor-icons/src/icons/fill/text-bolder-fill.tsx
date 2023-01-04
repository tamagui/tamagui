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
      <_Path d="M170.5,115.7A44,44,0,0,0,140,40H64a7.9,7.9,0,0,0-8,8V200a8,8,0,0,0,8,8h88a48,48,0,0,0,18.5-92.3ZM72,56h68a28,28,0,0,1,0,56H72Zm80,136H72V128h80a32,32,0,0,1,0,64Z" />
    </_Svg>
  )
}

Icon.displayName = 'TextBolderFill'

export const TextBolderFill = memo<IconProps>(themed(Icon))
