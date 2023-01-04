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
      <_Path d="M53.9,34.6A8,8,0,0,0,42,45.4l4.7,5.1A182.8,182.8,0,0,0,15.3,69.6,15.6,15.6,0,0,0,9.1,80.5a16.3,16.3,0,0,0,3.8,12.3L115.8,214a15.9,15.9,0,0,0,24.3.1l26.7-31.5,35.3,38.8A8.2,8.2,0,0,0,208,224a7.8,7.8,0,0,0,5.4-2.1,8,8,0,0,0,.6-11.3Z" />
      <_Path d="M246.9,80.5a15.6,15.6,0,0,0-6.2-10.9A188,188,0,0,0,92.6,35.3a8.3,8.3,0,0,0-6.1,5.4,8.2,8.2,0,0,0,1.7,7.9l93.4,102.7a8.3,8.3,0,0,0,5.9,2.6h.2a8.3,8.3,0,0,0,5.9-2.8l49.6-58.4A16.4,16.4,0,0,0,246.9,80.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'WifiSlashFill'

export const WifiSlashFill = memo<IconProps>(themed(Icon))
