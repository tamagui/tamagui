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
      <_Path d="M96,88a65.1,65.1,0,0,0,.4,7.7l-74.8,102a16,16,0,0,0,1.6,20.8l14.3,14.3a16,16,0,0,0,20.8,1.6l102-74.8a65.1,65.1,0,0,0,7.7.4,71.9,71.9,0,0,0,41.1-12.9,4,4,0,0,0,.5-6.1L115,46.4a4,4,0,0,0-6.1.5A71.9,71.9,0,0,0,96,88Zm17.7,65.7-20,20a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4l20-20a8.1,8.1,0,0,1,11.4,11.4ZM239.9,84a72,72,0,0,1-12.8,45.1,4,4,0,0,1-6.1.5L126.4,35a4,4,0,0,1,.5-6.1A72,72,0,0,1,239.9,84Z" />
    </_Svg>
  )
}

Icon.displayName = 'MicrophoneStageFill'

export const MicrophoneStageFill = memo<IconProps>(themed(Icon))
