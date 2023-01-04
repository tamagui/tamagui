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
      <_Path d="M128,28A100,100,0,1,0,228,128,100.2,100.2,0,0,0,128,28Zm8,183.6V180a8,8,0,0,0-16,0v31.6A84.2,84.2,0,0,1,44.4,136H76a8,8,0,0,0,0-16H44.4A84.2,84.2,0,0,1,120,44.4V76a8,8,0,0,0,16,0V44.4A84.2,84.2,0,0,1,211.6,120H180a8,8,0,0,0,0,16h31.6A84.2,84.2,0,0,1,136,211.6Z" />
    </_Svg>
  )
}

Icon.displayName = 'CrosshairSimpleFill'

export const CrosshairSimpleFill = memo<IconProps>(themed(Icon))
