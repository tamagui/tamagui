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
      <_Path d="M233.5,128v80a40.1,40.1,0,0,1-40,40H136a8,8,0,0,1,0-16h57.5a24.1,24.1,0,0,0,24-24v-1.4a23.6,23.6,0,0,1-8,1.4h-16a24,24,0,0,1-24-24V144a24,24,0,0,1,24-24h23.6a88,88,0,0,0-88.3-80h-.1a87.8,87.8,0,0,0-88.3,80H64a24.1,24.1,0,0,1,24,24v40a24.1,24.1,0,0,1-24,24H48a24.1,24.1,0,0,1-24-24V128A104,104,0,0,1,128.7,24h.8a104.1,104.1,0,0,1,104,104Z" />
    </_Svg>
  )
}

Icon.displayName = 'HeadsetFill'

export const HeadsetFill = memo<IconProps>(themed(Icon))
