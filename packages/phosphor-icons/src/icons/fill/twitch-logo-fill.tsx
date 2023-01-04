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
      <_Path d="M208,32H48A16,16,0,0,0,32,48V192a16,16,0,0,0,16,16H64v32a7.9,7.9,0,0,0,4.6,7.2,6.8,6.8,0,0,0,3.4.8,7.5,7.5,0,0,0,5.1-1.9L122.9,208h42.2a15.8,15.8,0,0,0,10.2-3.7l42.9-35.8a15.7,15.7,0,0,0,5.8-12.2V48A16,16,0,0,0,208,32ZM128,136a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'TwitchLogoFill'

export const TwitchLogoFill = memo<IconProps>(themed(Icon))
