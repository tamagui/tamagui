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
      <_Path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm36,136a8,8,0,0,1-16,0V137.6l-43.6,29.1A8.7,8.7,0,0,1,100,168a8.5,8.5,0,0,1-3.8-.9A8,8,0,0,1,92,160V96a8,8,0,0,1,4.2-7.1,8.3,8.3,0,0,1,8.2.4L148,118.4V96a8,8,0,0,1,16,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'SkipForwardCircleFill'

export const SkipForwardCircleFill = memo<IconProps>(themed(Icon))
