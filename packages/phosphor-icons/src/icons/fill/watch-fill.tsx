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
      <_Path d="M175.3,63.5l-6.2-34.4A16,16,0,0,0,153.3,16H102.7A16,16,0,0,0,86.9,29.1L80.7,63.5a80,80,0,0,0,0,129l6.2,34.4A16,16,0,0,0,102.7,240h50.6a16,16,0,0,0,15.8-13.1l6.2-34.4a80,80,0,0,0,0-129ZM102.7,32h50.6l3.9,21.6a78.9,78.9,0,0,0-58.4,0Zm50.6,192H102.7l-3.9-21.6a78.9,78.9,0,0,0,58.4,0ZM168,136H128a8,8,0,0,1-8-8V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'WatchFill'

export const WatchFill = memo<IconProps>(themed(Icon))
