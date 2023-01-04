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
      <_Path d="M237.7,29.7,211.3,56l5.4,5.4a31.9,31.9,0,0,1,0,45.2L191.3,132l2.4,2.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0l-8-8h0l-56-56h0l-8-8a8.1,8.1,0,0,1,11.4-11.4l2.3,2.4,25.4-25.4a31.9,31.9,0,0,1,45.2,0l5.4,5.4,26.3-26.4a8.1,8.1,0,0,1,11.4,11.4ZM138.3,138.3,120,156.7,99.3,136l18.4-18.3a8.1,8.1,0,0,0-11.4-11.4L88,124.7l-6.3-6.4h0l-8-8a8.1,8.1,0,0,0-11.4,11.4l2.4,2.3L39.3,149.4a31.9,31.9,0,0,0,0,45.2l5.4,5.4L18.3,226.3a8.1,8.1,0,0,0,0,11.4,8.2,8.2,0,0,0,11.4,0L56,211.3l5.4,5.4a31.9,31.9,0,0,0,45.2,0L132,191.3l2.3,2.4a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4l-8-8h0l-6.4-6.3,18.4-18.3a8.1,8.1,0,0,0-11.4-11.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'PlugsFill'

export const PlugsFill = memo<IconProps>(themed(Icon))
